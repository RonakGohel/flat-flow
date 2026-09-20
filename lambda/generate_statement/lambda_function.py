import json
import boto3
import os
import uuid
from decimal import Decimal  # DynamoDB freaks out if we use normal Python floats for money

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
    
# Setting up the connection to our single DynamoDB table. 
# We pull the table name from an environment variable so we don't hardcode it.
dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('TABLE_NAME', 'FlatFlow')
table = dynamodb.Table(TABLE_NAME)

# The browser will block our React app from talking to this API unless we allow CORS. 
# We put this in one place so we don't forget it on any response.
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Content-Type": "application/json"
}

def build_response(status_code, body):
    # API Gateway expects a very specific shape, so we use this helper 
    # to make sure every response (success or error) has the right headers.
    return {
        "statusCode": status_code,
        "headers": CORS_HEADERS,
        "body": json.dumps(body)  # API GW needs this to be a string, not a dict
    }

def lambda_handler(event, context):

    ok, err = require_group(event, 'admin')
    if not ok:
        return build_response(403, {"message": err})

    # API Gateway sends the request body as a raw string, so we have to parse it.
    # If the JSON is broken, we catch it here and send back a 400.
    try:
        body = json.loads(event.get('body', '{}'))
    except (json.JSONDecodeError, TypeError):
        return build_response(400, {"message": "Invalid JSON in request body."})

    # Grab the fields we need. Being specific with error messages 
    # saves the frontend team from guessing what went wrong.
    society_id = body.get('society_id')
    month = body.get('month')
    expenses = body.get('expenses')

    if not society_id:
        return build_response(400, {"message": "Missing required field: 'society_id'."})
    if not month:
        return build_response(400, {"message": "Missing required field: 'month'."})
    if not expenses or not isinstance(expenses, list):
        return build_response(400, {"message": "Missing or invalid field: 'expenses'."})

    # Loop through each expense and sanity check it. 
    # We don't want negative amounts or empty categories messing up our math later.
    for i, expense in enumerate(expenses):
        if not expense.get('category'):
            return build_response(400, {"message": f"Expense at index {i} is missing 'category'."})
        if expense.get('amount') is None:
            return build_response(400, {"message": f"Expense at index {i} is missing 'amount'."})
        if not isinstance(expense.get('amount'), (int, float)):
            return build_response(400, {"message": f"Expense at index {i} has a non-numeric 'amount'."})
        if expense['amount'] <= 0:
            return build_response(400, {"message": f"Expense at index {i} must be > 0."})
        if not expense.get('description'):
            return build_response(400, {"message": f"Expense at index {i} is missing 'description'."})

    try:
        # This is the single-table design. Every expense for a society 
        # gets grouped under the same partition key.
        pk = f"SOCIETY#{society_id}"
        items_written = 0

        for expense in expenses:
            # Add a random suffix to the sort key so that if the admin enters 
            # two "Repairs" expenses in the same month, they don't overwrite each other.
            random_suffix = str(uuid.uuid4())[:8]
            sk = f"EXPENSE#{month}#{expense['category']}#{random_suffix}"
            
            # We convert the amount to a string first, then to a Decimal. 
            # This is a known trick to avoid floating-point precision errors 
            # (like 10000.000000001) when saving to DynamoDB.
            amount_decimal = Decimal(str(expense['amount']))

            item = {
                'PK': pk,
                'SK': sk,
                'category': expense['category'],
                'amount': amount_decimal,
                'description': expense['description'],
                'month': month,
                'society_id': society_id
            }

            table.put_item(Item=item)
            items_written += 1

        return build_response(200, {
            "message": f"Successfully recorded {items_written} expense(s).",
            "society_id": society_id,
            "month": month,
            "items_written": items_written
        })

    except Exception as e:
        # If AWS throws an error (like permissions or throttling), 
        # we log the real error to CloudWatch but send a generic message to the user.
        print(f"[ERROR] Failed to write expenses: {str(e)}")
        return build_response(500, {"message": "Internal server error."})
