import json
import boto3
import os
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
    
# Connect to the single-table DynamoDB setup used across the application.
# The table name comes from an environment variable so it adapts across environments.
dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('TABLE_NAME', 'FlatFlow')
table = dynamodb.Table(TABLE_NAME)

# CORS headers so the admin dashboard on our React frontend can query expenses freely.
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Content-Type": "application/json"
}


def build_response(status_code, body):
    # Standard response wrapper for API Gateway compatibility.
    # default=str ensures Python's Decimal types from DynamoDB serialize safely into JSON strings.
    return {
        "statusCode": status_code,
        "headers": CORS_HEADERS,
        "body": json.dumps(body, default=str)
    }


def lambda_handler(event, context):

    ok, err = require_group(event, 'admin')
    if not ok:
        return build_response(403, {"message": err})

    # GET requests pass query parameters in event['queryStringParameters'].
    # We fallback to an empty dict so accessing parameters doesn't throw a NoneType error.
    query_params = event.get('queryStringParameters') or {}

    society_id = query_params.get('society_id')
    month = query_params.get('month')

    # Validate inputs upfront so administrative users get actionable error messages right away.
    if not society_id:
        return build_response(400, {"message": "Missing required query parameter: 'society_id'."})
    if not month:
        return build_response(400, {"message": "Missing required query parameter: 'month'."})

    try:
        # Query using the established single-table pattern.
        # SK format: EXPENSE#<month>#<category>#<uuid>. Using begins_with on EXPENSE#<month>
        # efficiently matches all expenses logged for that society in the requested month.
        pk = f"SOCIETY#{society_id}"
        sk_prefix = f"EXPENSE#{month}"

        response = table.query(
            KeyConditionExpression=Key('PK').eq(pk) & Key('SK').begins_with(sk_prefix)
        )

        items = response.get('Items', [])
        expenses = []

        for item in items:
            sk = item.get('SK', '')
            # Extract the UUID suffix from SK (format: EXPENSE#<month>#<category>#<uuid>).
            # The admin frontend needs this ID so it can issue targeted DELETE requests later.
            sk_parts = sk.split('#')
            expense_id = sk_parts[-1] if len(sk_parts) >= 4 else None

            expenses.append({
                "expense_id": expense_id,
                "category": item.get('category'),
                "amount": item.get('amount'),
                "description": item.get('description', '')
            })

        # Return 200 even when empty because an admin viewing a fresh or quiet month
        # expects an empty list (count: 0) rather than an error condition.
        return build_response(200, {
            "society_id": society_id,
            "month": month,
            "count": len(expenses),
            "expenses": expenses
        })

    except Exception as e:
        # Log error details internally for CloudWatch debugging, keeping user output generic.
        print(f"[ERROR] Failed to fetch admin expenses: {str(e)}")
        return build_response(500, {"message": "Internal server error."})
