import boto3

BUCKET_NAME = "flat-flow-bhakti2701"
REGION = "ap-south-1"

s3 = boto3.client("s3", region_name=REGION)


def upload_bill(file_path, s3_key):
    """
    Upload a bill/invoice to the Flat-Flow S3 bucket.
    """

    s3.upload_file(file_path, BUCKET_NAME, s3_key)

    return {
        "bucket": BUCKET_NAME,
        "key": s3_key,
        "s3_uri": f"s3://{BUCKET_NAME}/{s3_key}"
    }