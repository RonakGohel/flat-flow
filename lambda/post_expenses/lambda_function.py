import json
import boto3
import os
from decimal import Decimal, ROUND_HALF_UP
from boto3.dynamodb.conditions import Key

def require_group(event, allowed):
    try:
        claims = event['requestContext']['authorizer']['claims']
    except (KeyError, TypeError):
        return False, "Missing auth claims."
    raw = claims.get('cognito:groups', '')
    groups = raw if isinstance(raw, list) else raw.strip('[]').replace(',', ' ').split()
    if isinstance(allowed, str):
        allowed = [allowed]
    if not any(g in groups for g in allowed):
        return False, f"Access denied. Requires one of: {', '.join(allowed)}."
    return True, None
    
def require_group(event, allowed):
    try:
        claims = event['requestContext']['authorizer']['claims']
    except (KeyError, TypeError):
        return False, "Missing auth claims."
    raw = claims.get('cognito:groups', '')
    groups = raw if isinstance(raw, list) else raw.strip('[]').replace(',', ' ').split()
    if isinstance(allowed, str):
        allowed = [allowed]
    if not any(g in groups for g in allowed):
        return False, f"Access denied. Requires one of: {', '.join(allowed)}."
    return True, None
    
# Same single-table setup as our expenses Lambda.
# Both functions talk to the same FlatFlow table, just different item types.
dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('TABLE_NAME', 'FlatFlow')
table = dynamodb.Table(TABLE_NAME)

# CORS headers so our React frontend can call this endpoint without the browser blocking it.
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Content-Type": "application/json"
}


def build_response(status_code, body):
    # Helper to make sure every response has the right shape for API Gateway.
    # We also need to convert Decimal values to strings before json.dumps,
    # because Python's json module doesn't know how to handle Decimals.
    return {
        "statusCode": status_code,
        "headers": CORS_HEADERS,
        "body": json.dumps(body, default=str)
    }


def lambda_handler(event, context):

    ok, err = require_group(event, 'admin')
    if not ok:
        return build_response(403, {"message": err})

    # Parse the incoming request body. API Gateway sends it as a raw string.
    try:
        body = json.loads(event.get('body', '{}'))
    except (json.JSONDecodeError, TypeError):
        return build_response(400, {"message": "Invalid JSON in request body."})

    society_id = body.get('society_id')
    month = body.get('month')
    total_flats = body.get('total_flats')

    # Validate all three required fields upfront so the frontend gets clear error messages.
    if not society_id:
        return build_response(400, {"message": "Missing required field: 'society_id'."})
    if not month:
        return build_response(400, {"message": "Missing required field: 'month'."})
    if total_flats is None:
        return build_response(400, {"message": "Missing required field: 'total_flats'."})
    if not isinstance(total_flats, int) or total_flats <= 0:
        return build_response(400, {"message": "'total_flats' must be a positive integer."})

    try:
        # Query DynamoDB for all expenses belonging to this society in the given month.
        # Our sort key pattern is EXPENSE#<month>#<category>#<uuid>, so begins_with
        # EXPENSE#<month> grabs every category for that month in one shot.
        pk = f"SOCIETY#{society_id}"
        sk_prefix = f"EXPENSE#{month}"

        response = table.query(
            KeyConditionExpression=Key('PK').eq(pk) & Key('SK').begins_with(sk_prefix)
        )

        items = response.get('Items', [])

        # If there are no expenses for this month, there's nothing to calculate.
        # Return a 404 so the frontend can show "No expenses found" instead of ₹0.
        if not items:
            return build_response(404, {
                "message": f"No expenses found for society '{society_id}' in month '{month}'."
            })

        # Sum up all the expense amounts using Decimal so we don't run into
        # floating-point weirdness (like 15000.000000001 instead of 15000).
        total_amount = Decimal('0')
        expense_breakdown = []

        for item in items:
            amount = item['amount']  # already a Decimal from DynamoDB
            total_amount += amount
            expense_breakdown.append({
                "category": item['category'],
                "amount": amount,
                "description": item.get('description', '')
            })

        # Divide the total equally among all flats.
        # We round to 2 decimal places so we don't lose paise when splitting the bill.
        per_flat_amount = (total_amount / Decimal(str(total_flats))).quantize(
            Decimal('0.01'), rounding=ROUND_HALF_UP
        )

        return build_response(200, {
            "message": "Statement generated successfully.",
            "society_id": society_id,
            "month": month,
            "total_flats": total_flats,
            "total_expense": total_amount,
            "per_flat_amount": per_flat_amount,
            "expense_count": len(items),
            "breakdown": expense_breakdown
        })

    except Exception as e:
        # Log the real error for debugging in CloudWatch, but don't expose
        # internal details to the client — could be a security risk.
        print(f"[ERROR] Failed to generate statement: {str(e)}")
        return build_response(500, {"message": "Internal server error."})
