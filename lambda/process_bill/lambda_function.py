import json
import boto3
import os
import re

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
textract = boto3.client("textract")

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


def extract_text_from_s3(bucket, key):

    response = textract.detect_document_text(
        Document={
            "S3Object": {
                "Bucket": bucket,
                "Name": key
            }
        }
    )

    lines = []

    for block in response.get("Blocks", []):
        if block.get("BlockType") == "LINE":
            lines.append(block.get("Text", ""))

    return "\n".join(lines)


def parse_bill_text(text):

    result = {
        "category": None,
        "amount": None,
        "description": None,
        "bill_date": None,
        "due_date": None
    }

    # -----------------------------
    # Extract amount
    # -----------------------------

    amount_patterns = [
        r"(?:amount\s*payable|total\s*amount|bill\s*amount|amount|total)"
        r"\s*[:\-]?\s*(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d{1,2})?)"
    ]

    for pattern in amount_patterns:

        match = re.search(
            pattern,
            text,
            re.IGNORECASE
        )

        if match:
            amount_text = match.group(1).replace(",", "")

            try:
                result["amount"] = float(amount_text)
            except ValueError:
                pass

            break

    # -----------------------------
    # Detect category
    # -----------------------------

    category_keywords = {
        "Electricity": [
            "electricity",
            "electric",
            "power",
            "mahadiscom",
            "mseb"
        ],
        "Water": [
            "water",
            "water bill",
            "water supply"
        ],
        "Maintenance": [
            "maintenance",
            "society maintenance",
            "maintenance charges"
        ],
        "Security": [
            "security",
            "security guard"
        ],
        "Cleaning": [
            "cleaning",
            "housekeeping"
        ],
        "Lift": [
            "lift",
            "elevator"
        ]
    }

    text_lower = text.lower()

    for category, keywords in category_keywords.items():

        if any(keyword in text_lower for keyword in keywords):

            result["category"] = category
            break

    # -----------------------------
    # Extract bill date
    # -----------------------------

    date_patterns = [
        r"(?:bill\s*date|invoice\s*date|date)"
        r"\s*[:\-]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})"
    ]

    match = re.search(
        date_patterns[0],
        text,
        re.IGNORECASE
    )

    if match:
        result["bill_date"] = match.group(1)

    # -----------------------------
    # Extract due date
    # -----------------------------

    due_pattern = (
        r"(?:due\s*date|payment\s*due)"
        r"\s*[:\-]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})"
    )

    match = re.search(
        due_pattern,
        text,
        re.IGNORECASE
    )

    if match:
        result["due_date"] = match.group(1)

    # -----------------------------
    # Description
    # -----------------------------

    if result["category"]:
        result["description"] = (
            f"{result['category']} bill"
        )
    else:
        result["description"] = "Bill document"

    return result


def lambda_handler(event, context):


    ok, err = require_group(event, 'admin')
    if not ok:
        return build_response(403, {"message": err})
        
    try:

        body = json.loads(
            event.get("body", "{}")
        )

    except (json.JSONDecodeError, TypeError):

        return build_response(
            400,
            {
                "message": "Invalid JSON in request body."
            }
        )

    society_id = body.get("society_id")
    month = body.get("month")
    s3_key = body.get("s3_key")

    if not society_id:

        return build_response(
            400,
            {
                "message": "Missing required field: 'society_id'."
            }
        )

    if not month:

        return build_response(
            400,
            {
                "message": "Missing required field: 'month'."
            }
        )

    if not s3_key:

        return build_response(
            400,
            {
                "message": "Missing required field: 's3_key'."
            }
        )

    bucket_name = os.environ.get(
        "BILL_BUCKET",
        "flat-flow-bhakti2701"
    )

    try:

        # -----------------------------
        # Textract
        # -----------------------------

        extracted_text = extract_text_from_s3(
            bucket_name,
            s3_key
        )

        if not extracted_text.strip():

            return build_response(
                422,
                {
                    "message": "No readable text found in the document."
                }
            )

        # -----------------------------
        # Structured extraction
        # -----------------------------

        parsed_bill = parse_bill_text(
            extracted_text
        )

        # -----------------------------
        # Create draft
        # -----------------------------

        draft_id = s3_key.replace("/", "#")

        draft_item = {

            "PK": f"SOCIETY#{society_id}",

            "SK": (
                f"BILL_DRAFT#{month}#{draft_id}"
            ),

            "item_type": "BILL_DRAFT",

            "society_id": society_id,

            "month": month,

            "s3_bucket": bucket_name,

            "s3_key": s3_key,

            # Keep original OCR text
            "extracted_text": extracted_text,

            # Structured fields
            "category": parsed_bill["category"],

            "amount": parsed_bill["amount"],

            "description": parsed_bill["description"],

            "bill_date": parsed_bill["bill_date"],

            "due_date": parsed_bill["due_date"],

            # Important:
            # This is still NOT a confirmed expense.
            "status": "PENDING_REVIEW"
        }

        table.put_item(
            Item=draft_item
        )

        return build_response(
            200,
            {

                "message": (
                    "Bill processed successfully. "
                    "Draft created for admin review."
                ),

                "society_id": society_id,

                "month": month,

                "s3_bucket": bucket_name,

                "s3_key": s3_key,

                "status": "PENDING_REVIEW",

                "extracted_text": extracted_text,

                "parsed_bill": parsed_bill
            }
        )

    except Exception as e:

        print(
            f"[ERROR] Failed to process bill: {str(e)}"
        )

        return build_response(
            500,
            {
                "message": "Failed to process bill."
            }
        )
