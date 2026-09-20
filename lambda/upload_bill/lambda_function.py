import json
import boto3
import os
import base64
import uuid

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


s3 = boto3.client("s3")

BUCKET_NAME = os.environ.get(
    "BILL_BUCKET",
    "flat-flow-bhakti2701"
)


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
        "body": json.dumps(body)
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
    filename = body.get("filename")
    file_content = body.get("file_content")

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

    if not filename:
        return build_response(
            400,
            {"message": "Missing required field: 'filename'."}
        )

    if not file_content:
        return build_response(
            400,
            {"message": "Missing required field: 'file_content'."}
        )

    try:

        # Frontend sends the file as base64.
        file_bytes = base64.b64decode(file_content)

        unique_id = str(uuid.uuid4())[:8]

        s3_key = (
            f"bills/{society_id}/{month}/"
            f"{unique_id}_{filename}"
        )

        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=s3_key,
            Body=file_bytes
        )

        return build_response(
            200,
            {
                "message": "Bill uploaded successfully.",
                "society_id": society_id,
                "month": month,
                "bucket": BUCKET_NAME,
                "s3_key": s3_key,
                "s3_uri": f"s3://{BUCKET_NAME}/{s3_key}"
            }
        )

    except Exception as e:

        print(f"[ERROR] Failed to upload bill: {str(e)}")

        return build_response(
            500,
            {"message": "Failed to upload bill."}
        )
