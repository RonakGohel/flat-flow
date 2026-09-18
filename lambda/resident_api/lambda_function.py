import json
import boto3
import os
from decimal import Decimal, ROUND_HALF_UP
from boto3.dynamodb.conditions import Key

# Same single-table setup as our other Lambdas.
# Reads expense items from the FlatFlow table to build the resident statement view.
dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('TABLE_NAME', 'FlatFlow')
table = dynamodb.Table(TABLE_NAME)

# Hardcoded default total flats for now, as requested.
# In a future task, this could be stored in society metadata.
DEFAULT_TOTAL_FLATS = 20

# CORS headers so our React frontend can call this GET endpoint without the browser blocking it.
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Content-Type": "application/json"
}


def build_response(status_code, body):
    # Helper to make sure every response has the right shape for API Gateway.
    # We use default=str so Decimal values from DynamoDB don't crash json.dumps.
    return {
        "statusCode": status_code,
        "headers": CORS_HEADERS,
        "body": json.dumps(body, default=str)
    }


def lambda_handler(event, context):
    # GET requests send parameters in query string parameters instead of a JSON request body.
    # We extract queryStringParameters safely in case the caller sends no parameters at all.
    query_params = event.get('queryStringParameters') or {}

    society_id = query_params.get('society_id')
    month = query_params.get('month')

    # Validate query string parameters upfront so the caller gets helpful 400 responses.
    if not society_id:
        return build_response(400, {"message": "Missing required query parameter: 'society_id'."})
    if not month:
        return build_response(400, {"message": "Missing required query parameter: 'month'."})

    try:
        # Query DynamoDB using the same single-table partition/sort key pattern as Task 2.
        # PK = SOCIETY#<id>, SK begins_with EXPENSE#<month> grabs every expense for that month.
        pk = f"SOCIETY#{society_id}"
        sk_prefix = f"EXPENSE#{month}"

        response = table.query(
            KeyConditionExpression=Key('PK').eq(pk) & Key('SK').begins_with(sk_prefix)
        )

        items = response.get('Items', [])

        # If there are no expenses found for this month, return a 404 so the frontend
        # can display a clear "No statement available" message rather than empty data.
        if not items:
            return build_response(404, {
                "message": f"No expenses found for society '{society_id}' in month '{month}'."
            })

        # Calculate total expense and construct the detailed breakdown for each item.
        # We use Decimal arithmetic throughout to avoid floating-point rounding errors.
        total_amount = Decimal('0')
        expense_breakdown = []

        for item in items:
            amount = item['amount']  # Decimal type returned directly by DynamoDB
            total_amount += amount
            expense_breakdown.append({
                "category": item['category'],
                "amount": amount,
                "description": item.get('description', '')
            })

        # Calculate per-flat cost by dividing total expense by the flat count (hardcoded to 20).
        # We round up half to 2 decimal places to keep currency values precise.
        total_flats = DEFAULT_TOTAL_FLATS
        per_flat_amount = (total_amount / Decimal(str(total_flats))).quantize(
            Decimal('0.01'), rounding=ROUND_HALF_UP
        )

        # Return the final statement JSON object required by the resident view.
        return build_response(200, {
            "society_id": society_id,
            "month": month,
            "total_expense": total_amount,
            "per_flat_amount": per_flat_amount,
            "total_flats": total_flats,
            "breakdown": expense_breakdown
        })

    except Exception as e:
        # Catch unexpected errors, log details to CloudWatch, and hide specifics from response.
        print(f"[ERROR] Failed to fetch statement: {str(e)}")
        return build_response(500, {"message": "Internal server error."})
