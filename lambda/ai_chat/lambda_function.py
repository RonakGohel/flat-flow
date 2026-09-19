import json
import boto3
import os
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('TABLE_NAME', 'FlatFlow')
table = dynamodb.Table(TABLE_NAME)

bedrock_runtime = boto3.client('bedrock-runtime')
MODEL_ID = 'anthropic.claude-sonnet-4-20250514-v1:0'

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


def fetch_expenses(society_id, month):
    pk = f"SOCIETY#{society_id}"
    sk_prefix = f"EXPENSE#{month}"

    response = table.query(
        KeyConditionExpression=Key('PK').eq(pk) &
        Key('SK').begins_with(sk_prefix)
    )

    return response.get('Items', [])


def build_expense_summary(items):
    if not items:
        return "No expenses recorded for this period."

    lines = []
    total = 0

    for item in items:
        category = item.get('category', 'Unknown')
        amount = item.get('amount', 0)
        description = item.get('description', '')

        lines.append(
            f"- {category}: ₹{amount} ({description})"
        )

        total += float(amount)

    lines.append(f"\nTotal: ₹{total:.2f}")

    return "\n".join(lines)


def build_evidence(items):
    """
    Build evidence directly from DynamoDB.

    This is intentionally created by code rather than Bedrock,
    so the AI cannot invent supporting financial figures.
    """

    evidence = []

    for item in items:
        evidence.append({
            "category": item.get("category", "Unknown"),
            "amount": str(item.get("amount", "0")),
            "description": item.get("description", ""),
            "source": item.get("source", "DynamoDB"),
            "verified": item.get("verified", False),
            "expenseKey": item.get("SK", "")
        })

    return evidence


def lambda_handler(event, context):

    try:
        body = json.loads(event.get('body', '{}'))
    except (json.JSONDecodeError, TypeError):
        return build_response(
            400,
            {"message": "Invalid JSON in request body."}
        )

    society_id = body.get('society_id')
    month = body.get('month')
    resident_question = body.get('resident_question')

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

    if not resident_question or not isinstance(resident_question, str):
        return build_response(
            400,
            {"message": "Missing required field: 'resident_question'."}
        )

    # Fetch verified expense data from DynamoDB.
    try:
        items = fetch_expenses(society_id, month)

    except Exception as e:
        print(
            f"[ERROR] Failed to fetch expenses from DynamoDB: {str(e)}"
        )

        return build_response(
            500,
            {"message": "Failed to retrieve expense data."}
        )

    # Build summary for Bedrock.
    expense_summary = build_expense_summary(items)

    # Build evidence directly from DynamoDB.
    evidence = build_evidence(items)

    # Grounding flag is determined by the application,
    # not by the AI.
    grounding_verified = len(items) > 0

    system_prompt = (
        "You are a financial transparency assistant for a residential society. "
        "Your job is to help residents understand their maintenance charges.\n\n"

        "Rules:\n"
        "- Only answer using the provided expense data.\n"
        "- Do not invent numbers, expenses, categories, or reasons.\n"
        "- Do not perform calculations that are not supported by the provided data.\n"
        "- If the data does not contain the answer, say "
        "'I don't have that information in the current expense records.'\n"
        "- Use simple, neutral language.\n"
        "- Never accuse anyone of fraud.\n"
        "- Keep the answer concise.\n"
    )

    user_message = (
        f"Here is the verified expense data for society "
        f"{society_id} for the month {month}:\n\n"

        f"{expense_summary}\n\n"

        f"Resident's question: {resident_question}\n\n"

        "Answer the resident using only the provided data."
    )

    bedrock_body = json.dumps({
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 500,
        "system": system_prompt,
        "messages": [
            {
                "role": "user",
                "content": user_message
            }
        ]
    })

    try:

        response = bedrock_runtime.invoke_model(
            modelId=MODEL_ID,
            body=bedrock_body,
            contentType="application/json",
            accept="application/json"
        )

        response_body = json.loads(
            response['body'].read()
        )

        ai_answer = response_body['content'][0]['text']

        return build_response(
            200,
            {
                "message": "AI response generated successfully.",
                "society_id": society_id,
                "month": month,
                "question": resident_question,
                "answer": ai_answer,
                "evidence": evidence,
                "groundingVerified": grounding_verified
            }
        )

    except ClientError as e:

        error_code = e.response['Error']['Code']
        error_message = e.response['Error']['Message']

        print(
            f"[ERROR] Bedrock API call failed - "
            f"{error_code}: {error_message}"
        )

        return build_response(
            500,
            {
                "message": "Failed to generate AI response. "
                           "Please try again later."
            }
        )

    except Exception as e:

        print(
            f"[ERROR] Unexpected error during AI response generation: "
            f"{str(e)}"
        )

        return build_response(
            500,
            {"message": "Internal server error."}
        )
