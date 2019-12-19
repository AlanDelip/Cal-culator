import os
import boto3
import json
import base64

# grab environment variables
ENDPOINT_NAME = 'FoodDetector'
BUCKET_NAME = 'calculator-recognition'
LABELS = ["banana", "apple", "sandwich", "orange", "broccoli", "carrot", "hot dog", "pizza", "donut", "cake"]

def lambda_handler(event, context):
    # print("event: {}".format(event))
    #photo=event["Records"][0]["s3"]["object"]["key"]
    photo_key = json.loads(event['body'])['key']
    
    client = boto3.client('s3')
    s3_response = client.get_object(
        Bucket=BUCKET_NAME,
        Key=photo_key,
    )
        
    sb = s3_response['Body']
    photo_meta = sb.read()
    
    runtime= boto3.client('runtime.sagemaker')
    response = runtime.invoke_endpoint(EndpointName=ENDPOINT_NAME,
                                      ContentType='image/png',
                                      Body=photo_meta)
    result = json.loads(response['Body'].read().decode())
    
    clean_result = [f for f in result if f['id'] in LABELS]

    return {
            'statusCode': 200,
            "headers": {
                "Access-Control-Allow-Origin" : "*", # Required for CORS support to work
                "Access-Control-Allow-Credentials" : True # Required for cookies, authorization headers with HTTPS
            },
            'body': json.dumps(clean_result)
        }
        