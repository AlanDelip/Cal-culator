import json
import boto3

USER_TBL = "user-profile"

def storeUserProfile(profile):
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1',
                              endpoint_url="https://dynamodb.us-east-1.amazonaws.com")
    table = dynamodb.Table(USER_TBL)
    response = table.put_item(Item=profile)
    print('Item inserted to passcodes table. Respose: '.format(response))

def lambda_handler(event, context):
    # TODO implement
    storeUserProfile(json.loads(event["body"]))
    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Origin" : "*", # Required for CORS support to work
            "Access-Control-Allow-Credentials" : True # Required for cookies, authorization headers with HTTPS
        },
        'body': json.dumps(event)
    }
