import json
import os
import boto3
from decimal import Decimal
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


dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ.get("TABLE_NAME", "FlatFlow"))

DEFAULT_TOTAL_FLATS = 20


def decimal_to_number(value):
    if isinstance(value, Decimal):
        if value % 1 == 0:
            return int(value)
        return float(value)

    return value


def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Allow-Methods": "GET,OPTIONS",
        },
        "body": json.dumps(body, default=decimal_to_number),
    }


def lambda_handler(event, context):

    ok, err = require_group(event, 'resident')
    if not ok:
        return build_response(403, {"message": err})

    try:
        query_params = event.get("queryStringParameters") or {}

        society_id = query_params.get("society_id")
        month = query_params.get("month")

        if not society_id:
            return response(
                400,
                {"message": "society_id is required"},
            )

        if not month:
            return response(
                400,
                {"message": "month is required"},
            )

        # ---------------------------------------------------------
        # 1. Load society metadata
        # ---------------------------------------------------------

        society_result = table.get_item(
            Key={
                "PK": f"SOCIETY#{society_id}",
                "SK": "META",
            }
        )

        society = society_result.get("Item", {})

        total_flats = society.get(
            "total_flats",
            DEFAULT_TOTAL_FLATS,
        )

        total_flats = int(total_flats)

        if total_flats <= 0:
            return response(
                500,
                {"message": "Invalid total_flats configured for society"},
            )

        # ---------------------------------------------------------
        # 2. Load monthly expenses
        # ---------------------------------------------------------

        result = table.query(
            KeyConditionExpression=(
                Key("PK").eq(f"SOCIETY#{society_id}")
                & Key("SK").begins_with(f"EXPENSE#{month}")
            )
        )

        items = result.get("Items", [])

        if not items:
            return response(
                404,
                {
                    "message": "No expenses found",
                    "society_id": society_id,
                    "month": month,
                },
            )

        # ---------------------------------------------------------
        # 3. Calculate total expense
        # ---------------------------------------------------------

        total_expense = sum(
            Decimal(str(item.get("amount", 0)))
            for item in items
        )

        per_flat_amount = (
            total_expense / Decimal(total_flats)
        )

        # ---------------------------------------------------------
        # 4. Build category breakdown
        # ---------------------------------------------------------

        breakdown = []

        for item in items:
            breakdown.append(
                {
                    "category": item.get("category", "Unknown"),
                    "amount": item.get("amount", 0),
                    "description": item.get(
                        "description",
                        "",
                    ),
                }
            )

        # ---------------------------------------------------------
        # 5. Return live statement
        # ---------------------------------------------------------

        return response(
            200,
            {
                "society_id": society_id,
                "society_name": society.get(
                    "name",
                    society_id,
                ),
                "city": society.get(
                    "city",
                    "",
                ),
                "month": month,
                "total_expense": total_expense,
                "per_flat_amount": per_flat_amount,
                "total_flats": total_flats,
                "breakdown": breakdown,
            },
        )

    except Exception as error:
        print("ERROR:", str(error))

        return response(
            500,
            {
                "message": "Internal server error",
                "error": str(error),
            },
        )
