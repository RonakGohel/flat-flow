import json
import boto3
import os
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key

# Same single-table setup as our other Lambdas.
# This function reads expenses from FlatFlow, then hands them to Bedrock for explanation.
dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('TABLE_NAME', 'FlatFlow')
table = dynamodb.Table(TABLE_NAME)

# Bedrock client for calling Claude. We use bedrock-runtime (not bedrock)
# because we're invoking a model, not managing one.
bedrock_runtime = boto3.client('bedrock-runtime')
MODEL_ID = 'anthropic.claude-3-haiku-20240307-v1:0'

# CORS headers so our React frontend can call this endpoint without the browser blocking it.
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
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


def fetch_expenses(society_id, month):
    # Query DynamoDB for all expenses belonging to this society in the given month.
    # Same key pattern as generate_statement: PK = SOCIETY#<id>, SK begins with EXPENSE#<month>.
    pk = f"SOCIETY#{society_id}"
    sk_prefix = f"EXPENSE#{month}"

    response = table.query(
        KeyConditionExpression=Key('PK').eq(pk) & Key('SK').begins_with(sk_prefix)
    )

    return response.get('Items', [])


def build_expense_summary(items):
    # Turn the raw DynamoDB items into a readable summary string for the AI.
    # We keep it simple — category, amount, description — so the model has
    # clean data to work with and doesn't have to parse DynamoDB key formats.
    if not items:
        return "No expenses recorded for this period."

    lines = []
    total = 0

    for item in items:
        category = item.get('category', 'Unknown')
        amount = item.get('amount', 0)
        description = item.get('description', '')
        lines.append(f"- {category}: ₹{amount} ({description})")
        total += float(amount)

    lines.append(f"\nTotal: ₹{total:.2f}")
    return "\n".join(lines)


def lambda_handler(event, context):
    # Parse the incoming request body. API Gateway sends it as a raw string.
    try:
        body = json.loads(event.get('body', '{}'))
    except (json.JSONDecodeError, TypeError):
        return build_response(400, {"message": "Invalid JSON in request body."})

    society_id = body.get('society_id')
    month = body.get('month')
    resident_question = body.get('resident_question')

    # Validate all three required fields upfront so the frontend gets clear error messages.
    if not society_id:
        return build_response(400, {"message": "Missing required field: 'society_id'."})
    if not month:
        return build_response(400, {"message": "Missing required field: 'month'."})
    if not resident_question or not isinstance(resident_question, str):
        return build_response(400, {"message": "Missing required field: 'resident_question'."})

    # Fetch the verified expense data from DynamoDB first.
    # The AI should only explain what's actually in the database — no guessing.
    try:
        items = fetch_expenses(society_id, month)
    except Exception as e:
        print(f"[ERROR] Failed to fetch expenses from DynamoDB: {str(e)}")
        return build_response(500, {"message": "Failed to retrieve expense data."})

    # Build a human-readable expense summary to inject into the prompt.
    expense_summary = build_expense_summary(items)

    # We construct a strict system prompt because we don't want the AI to hallucinate
    # numbers or make accusations. It should only explain what the data shows.
    system_prompt = (
        "You are a financial transparency assistant for a residential society. "
        "Your job is to help residents understand their maintenance charges.\n\n"
        "Rules:\n"
        "- Only answer using the provided expense data. Do not invent numbers or reasons.\n"
        "- If the data doesn't contain the answer, say 'I don't have that information in the current expense records.'\n"
        "- Use simple, neutral language. Never accuse anyone of fraud.\n"
        "- Be concise and helpful."
    )

    # Combine the expense data and the resident's question into one user message.
    # Putting the data first gives the model context before it sees the question.
    user_message = (
        f"Here is the verified expense data for society {society_id} for the month {month}:\n\n"
        f"{expense_summary}\n\n"
        f"Resident's question: {resident_question}"
    )

    # Call Bedrock with the Messages API format that Claude expects.
    # max_tokens is capped at 500 because residents just need a short explanation,
    # not a full financial audit.
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

        # Bedrock returns the response body as a StreamingBody, so we read and parse it.
        # The actual text answer lives inside response_body['content'][0]['text'] —
        # that's the shape Bedrock uses for Claude's Messages API.
        response_body = json.loads(response['body'].read())
        ai_answer = response_body['content'][0]['text']

        return build_response(200, {
            "message": "AI response generated successfully.",
            "society_id": society_id,
            "month": month,
            "question": resident_question,
            "answer": ai_answer
        })

    except ClientError as e:
        # Bedrock-specific errors (wrong model ID, permissions, throttling, etc.).
        # We log the full error for debugging but only send a safe message to the client.
        error_code = e.response['Error']['Code']
        error_message = e.response['Error']['Message']
        print(f"[ERROR] Bedrock API call failed — {error_code}: {error_message}")
        return build_response(500, {
            "message": "Failed to generate AI response. Please try again later."
        })

    except Exception as e:
        # Catch-all for anything unexpected (network issues, malformed response, etc.).
        print(f"[ERROR] Unexpected error during AI response generation: {str(e)}")
        return build_response(500, {"message": "Internal server error."})
