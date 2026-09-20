import json
import boto3
import os
import uuid
from decimal import Decimal

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
    
dynamodb = boto3.resource("dynamodb")

TABLE_NAME = os.environ.get("TABLE_NAME", "FlatFlow")
table = dynamodb.Table(TABLE_NAME)


CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Content-Type": "application/json"
}


def build_response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": CORS_HEADERS,
        "body": json.dumps(body, default=str)
    }


def lambda_handler(event, context):

    ok, err = require_group(event, 'admin')
    if not ok:
        return build_response(403, {"message": err})
        
    try:
        body = json.loads(event.get("body", "{}"))
    except (json.JSONDecodeError, TypeError):
        return build_response(
            400,
            {"message": "Invalid JSON in request body."}
        )

    society_id = body.get("society_id")
    month = body.get("month")
    category = body.get("category")
    amount = body.get("amount")
    description = body.get("description")
    draft_sk = body.get("draft_sk")

    if not society_id:
        return build_response(
            400,
            {"message": "Missing required field: 'society_id'."}
        )

    if not month:
        return build_response(
            400,
            {"message": "Missing required field: 'month'."}
        )

    if not category:
        return build_response(
            400,
            {"message": "Missing required field: 'category'."}
        )

    if amount is None:
        return build_response(
            400,
            {"message": "Missing required field: 'amount'."}
        )

    if not isinstance(amount, (int, float)) or amount <= 0:
        return build_response(
            400,
            {"message": "'amount' must be a positive number."}
        )

    if not description:
        return build_response(
            400,
            {"message": "Missing required field: 'description'."}
        )

    if not draft_sk:
        return build_response(
            400,
            {"message": "Missing required field: 'draft_sk'."}
        )

    try:

        # Make sure the draft exists.
        draft_response = table.get_item(
            Key={
                "PK": f"SOCIETY#{society_id}",
                "SK": draft_sk
            }
        )

        draft = draft_response.get("Item")

        if not draft:
            return build_response(
                404,
                {"message": "Bill draft not found."}
            )

        if draft.get("status") != "PENDING_REVIEW":
            return build_response(
                400,
                {"message": "This bill draft has already been processed."}
            )

        # Create the confirmed expense item.
        random_suffix = str(uuid.uuid4())[:8]

        expense_sk = (
            f"EXPENSE#{month}#{category}#{random_suffix}"
        )

        expense_item = {
            "PK": f"SOCIETY#{society_id}",
            "SK": expense_sk,
            "category": category,
            "amount": Decimal(str(amount)),
            "description": description,
            "month": month,
            "society_id": society_id,
            "source": "BILL",
            "source_s3_key": draft.get("s3_key"),
            "verified": True
        }

        table.put_item(Item=expense_item)

        # Mark the original draft as confirmed.
        table.update_item(
            Key={
                "PK": f"SOCIETY#{society_id}",
                "SK": draft_sk
            },
            UpdateExpression="SET #status = :status",
            ExpressionAttributeNames={
                "#status": "status"
            },
            ExpressionAttributeValues={
                ":status": "CONFIRMED"
            }
        )

        return build_response(
            200,
            {
                "message": "Bill confirmed and expense recorded successfully.",
                "society_id": society_id,
                "month": month,
                "category": category,
                "amount": amount,
                "description": description,
                "expense_sk": expense_sk,
                "draft_sk": draft_sk,
                "verified": True
            }
        )

    except Exception as e:

        print(
            f"[ERROR] Failed to confirm bill: {str(e)}"
        )

        return build_response(
            500,
            {"message": "Failed to confirm bill."}
        )
