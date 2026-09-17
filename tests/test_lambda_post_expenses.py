"""
Tests for POST /expenses Lambda function.
Uses moto to mock DynamoDB so we never hit real AWS.

The function lives in lambda/post_expenses/ — 'lambda' is a Python keyword,
so we use importlib to load it.
"""

import json
import os
import sys
import importlib
import pytest
import boto3
from moto import mock_aws
from decimal import Decimal

# Point the Lambda at our test table before it gets imported
os.environ["TABLE_NAME"] = "FlatFlow"
os.environ["AWS_DEFAULT_REGION"] = "ap-south-1"
os.environ["AWS_ACCESS_KEY_ID"] = "testing"
os.environ["AWS_SECRET_ACCESS_KEY"] = "testing"


def _load_lambda_module():
    """Import lambda/post_expenses/lambda_function.py despite 'lambda' being a keyword."""
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    module_path = os.path.join(project_root, "lambda", "post_expenses", "lambda_function.py")
    spec = importlib.util.spec_from_file_location("lambda_function", module_path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


@pytest.fixture
def dynamodb_table():
    """Spin up a fake DynamoDB table that matches our single-table design."""
    with mock_aws():
        client = boto3.resource("dynamodb", region_name="ap-south-1")
        table = client.create_table(
            TableName="FlatFlow",
            KeySchema=[
                {"AttributeName": "PK", "KeyType": "HASH"},
                {"AttributeName": "SK", "KeyType": "RANGE"},
            ],
            AttributeDefinitions=[
                {"AttributeName": "PK", "AttributeType": "S"},
                {"AttributeName": "SK", "AttributeType": "S"},
            ],
            BillingMode="PAY_PER_REQUEST",
        )
        table.meta.client.get_waiter("table_exists").wait(TableName="FlatFlow")

        # Load the module INSIDE the mock context so its top-level
        # boto3.resource() call gets the mocked DynamoDB
        mod = _load_lambda_module()

        yield table, mod


def _make_event(body):
    """Build a minimal API Gateway proxy event."""
    return {
        "body": json.dumps(body) if isinstance(body, dict) else body,
        "httpMethod": "POST",
    }


# ── Happy path ──────────────────────────────────────────────────────

class TestHappyPath:
    def test_single_expense(self, dynamodb_table):
        table, mod = dynamodb_table
        event = _make_event({
            "society_id": "SOC001",
            "month": "2026-09",
            "expenses": [
                {"category": "Security", "amount": 12000, "description": "Shield Guards monthly"}
            ],
        })
        resp = mod.lambda_handler(event, None)
        body = json.loads(resp["body"])

        assert resp["statusCode"] == 200
        assert body["items_written"] == 1
        assert body["society_id"] == "SOC001"
        assert body["month"] == "2026-09"

    def test_multiple_expenses(self, dynamodb_table):
        table, mod = dynamodb_table
        event = _make_event({
            "society_id": "SOC001",
            "month": "2026-09",
            "expenses": [
                {"category": "Security", "amount": 12000, "description": "Guards"},
                {"category": "Housekeeping", "amount": 8000, "description": "Cleaning"},
                {"category": "Water", "amount": 5000, "description": "Water bill"},
            ],
        })
        resp = mod.lambda_handler(event, None)
        body = json.loads(resp["body"])

        assert resp["statusCode"] == 200
        assert body["items_written"] == 3

    def test_items_stored_in_dynamodb(self, dynamodb_table):
        table, mod = dynamodb_table
        event = _make_event({
            "society_id": "SOC002",
            "month": "2026-08",
            "expenses": [
                {"category": "Lift AMC", "amount": 5000, "description": "OtisCare AMC"},
            ],
        })
        mod.lambda_handler(event, None)

        # Verify the item actually landed in the table
        result = table.scan()
        items = [i for i in result["Items"] if i["PK"] == "SOCIETY#SOC002"]
        assert len(items) == 1
        assert items[0]["category"] == "Lift AMC"
        assert items[0]["amount"] == Decimal("5000")

    def test_float_amount_stored_as_decimal(self, dynamodb_table):
        """DynamoDB hates floats; make sure we convert to Decimal cleanly."""
        table, mod = dynamodb_table
        event = _make_event({
            "society_id": "SOC001",
            "month": "2026-09",
            "expenses": [
                {"category": "Water", "amount": 5000.75, "description": "Water bill"},
            ],
        })
        mod.lambda_handler(event, None)
        result = table.scan()
        assert result["Items"][0]["amount"] == Decimal("5000.75")

    def test_cors_headers_present(self, dynamodb_table):
        _, mod = dynamodb_table
        event = _make_event({
            "society_id": "SOC001",
            "month": "2026-09",
            "expenses": [
                {"category": "Security", "amount": 12000, "description": "Guards"},
            ],
        })
        resp = mod.lambda_handler(event, None)
        assert resp["headers"]["Access-Control-Allow-Origin"] == "*"
        assert "POST" in resp["headers"]["Access-Control-Allow-Methods"]


# ── Validation errors ───────────────────────────────────────────────

class TestValidation:
    def test_missing_society_id(self, dynamodb_table):
        _, mod = dynamodb_table
        event = _make_event({"month": "2026-09", "expenses": [{"category": "X", "amount": 1, "description": "Y"}]})
        resp = mod.lambda_handler(event, None)
        assert resp["statusCode"] == 400
        assert "society_id" in json.loads(resp["body"])["message"]

    def test_missing_month(self, dynamodb_table):
        _, mod = dynamodb_table
        event = _make_event({"society_id": "SOC001", "expenses": [{"category": "X", "amount": 1, "description": "Y"}]})
        resp = mod.lambda_handler(event, None)
        assert resp["statusCode"] == 400
        assert "month" in json.loads(resp["body"])["message"]

    def test_missing_expenses(self, dynamodb_table):
        _, mod = dynamodb_table
        event = _make_event({"society_id": "SOC001", "month": "2026-09"})
        resp = mod.lambda_handler(event, None)
        assert resp["statusCode"] == 400
        assert "expenses" in json.loads(resp["body"])["message"]

    def test_expenses_not_a_list(self, dynamodb_table):
        _, mod = dynamodb_table
        event = _make_event({"society_id": "SOC001", "month": "2026-09", "expenses": "not a list"})
        resp = mod.lambda_handler(event, None)
        assert resp["statusCode"] == 400

    def test_expense_missing_category(self, dynamodb_table):
        _, mod = dynamodb_table
        event = _make_event({
            "society_id": "SOC001", "month": "2026-09",
            "expenses": [{"amount": 100, "description": "No category"}],
        })
        resp = mod.lambda_handler(event, None)
        assert resp["statusCode"] == 400
        assert "category" in json.loads(resp["body"])["message"]

    def test_expense_missing_amount(self, dynamodb_table):
        _, mod = dynamodb_table
        event = _make_event({
            "society_id": "SOC001", "month": "2026-09",
            "expenses": [{"category": "Water", "description": "No amount"}],
        })
        resp = mod.lambda_handler(event, None)
        assert resp["statusCode"] == 400
        assert "amount" in json.loads(resp["body"])["message"]

    def test_expense_negative_amount(self, dynamodb_table):
        _, mod = dynamodb_table
        event = _make_event({
            "society_id": "SOC001", "month": "2026-09",
            "expenses": [{"category": "Water", "amount": -500, "description": "Negative"}],
        })
        resp = mod.lambda_handler(event, None)
        assert resp["statusCode"] == 400
        assert "> 0" in json.loads(resp["body"])["message"]

    def test_expense_zero_amount(self, dynamodb_table):
        _, mod = dynamodb_table
        event = _make_event({
            "society_id": "SOC001", "month": "2026-09",
            "expenses": [{"category": "Water", "amount": 0, "description": "Zero"}],
        })
        resp = mod.lambda_handler(event, None)
        assert resp["statusCode"] == 400

    def test_expense_non_numeric_amount(self, dynamodb_table):
        _, mod = dynamodb_table
        event = _make_event({
            "society_id": "SOC001", "month": "2026-09",
            "expenses": [{"category": "Water", "amount": "five thousand", "description": "String amount"}],
        })
        resp = mod.lambda_handler(event, None)
        assert resp["statusCode"] == 400
        assert "non-numeric" in json.loads(resp["body"])["message"]

    def test_expense_missing_description(self, dynamodb_table):
        _, mod = dynamodb_table
        event = _make_event({
            "society_id": "SOC001", "month": "2026-09",
            "expenses": [{"category": "Water", "amount": 5000}],
        })
        resp = mod.lambda_handler(event, None)
        assert resp["statusCode"] == 400
        assert "description" in json.loads(resp["body"])["message"]


# ── Bad request body ────────────────────────────────────────────────

class TestBadBody:
    def test_invalid_json(self, dynamodb_table):
        _, mod = dynamodb_table
        event = {"body": "{{broken json", "httpMethod": "POST"}
        resp = mod.lambda_handler(event, None)
        assert resp["statusCode"] == 400
        assert "Invalid JSON" in json.loads(resp["body"])["message"]

    def test_null_body(self, dynamodb_table):
        _, mod = dynamodb_table
        event = {"body": None, "httpMethod": "POST"}
        resp = mod.lambda_handler(event, None)
        # body=None → json.loads('{}') → missing fields → 400
        assert resp["statusCode"] == 400

    def test_empty_body(self, dynamodb_table):
        _, mod = dynamodb_table
        event = {"httpMethod": "POST"}
        resp = mod.lambda_handler(event, None)
        assert resp["statusCode"] == 400


# ── Sort key uniqueness ────────────────────────────────────────────

class TestSortKeyUniqueness:
    def test_same_category_twice_does_not_overwrite(self, dynamodb_table):
        """Two 'Security' expenses in the same month must create two separate items."""
        table, mod = dynamodb_table
        event = _make_event({
            "society_id": "SOC001",
            "month": "2026-09",
            "expenses": [
                {"category": "Security", "amount": 12000, "description": "First guard bill"},
                {"category": "Security", "amount": 8000, "description": "Second guard bill"},
            ],
        })
        resp = mod.lambda_handler(event, None)
        body = json.loads(resp["body"])
        assert body["items_written"] == 2

        result = table.scan()
        security_items = [i for i in result["Items"] if i["category"] == "Security"]
        assert len(security_items) == 2
