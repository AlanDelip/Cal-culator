import json
import boto3
from datetime import datetime

USER_TBL = "user-profile"
RECORD_TBL = 'records'
BUCKET_NAME = 'calculator-recognition'


def create_presigned_url(object_name, expiration=3600):
    """Generate a presigned URL to share an S3 object

    :param bucket_name: string
    :param object_name: string
    :param expiration: Time in seconds for the presigned URL to remain valid
    :return: Presigned URL as string. If error, returns None.
    """

    # Generate a presigned URL for the S3 object
    s3_client = boto3.client('s3')
    try:
        response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': BUCKET_NAME,
                                                            'Key': object_name},
                                                    ExpiresIn=expiration)
    except ClientError as e:
        logging.error(e)
        return None

    # The response contains the presigned URL
    '''
    result=requests.get(response)
    print(result)
    '''
    return response 
    
    
activityFactor = {
    0: 1.2,
    1: 1.375,
    2: 1.375,
    3: 1.375,
    4: 1.55,
    5: 1.55,
    6: 1.725,
    7: 1.725
}

def calculateFemaleBaseCalories(userProfile):
    return activityFactor[float(userProfile['daysExercise'])] * (655 + (4.3 * float(userProfile['weight'])) + (4.7 * float(userProfile['height'])) - (4.7 * float(userProfile['age'])))


def calculateMaleBaseCalories(userProfile):
    return activityFactor[float(userProfile['daysExercise'])] * (66 + (6.3 * float(userProfile['weight'])) + (12.9 * float(userProfile['height'])) - (6.8 * float(userProfile['age'])))


def calculateBaseCalories(username):
    userProfile = retrieveUserProfile(username)
    if userProfile == None:
        return {"Error":"User does not exist!"}
    if userProfile["gender"] == "female":
        return calculateFemaleBaseCalories(userProfile)
    else:
        return calculateMaleBaseCalories(userProfile)


def retrieveUserProfile(username):
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1',
                              endpoint_url="https://dynamodb.us-east-1.amazonaws.com")
    profileTable = dynamodb.Table(USER_TBL)

    print('Retrieving User Profile...username: {}'.format(username))
    profileTableResponse = profileTable.get_item(
                    Key={'username': username}
                )
    print('User Profile retrieved: {} '.format(profileTableResponse))
    if 'Item' in profileTableResponse:
        item = profileTableResponse['Item']
        
        birthyear = datetime.strptime(item['birthday'],'%Y/%m/%d').year
        item['age'] = datetime.now().year - birthyear
        return item
    else:
        return None
    
  
def retrieveUserRecords(username):
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1',
                              endpoint_url="https://dynamodb.us-east-1.amazonaws.com")
    recordsTable = dynamodb.Table(RECORD_TBL)
    
    print('Retrieving User Recores...username: {}'.format(username))
    recordsTableResponse = recordsTable.get_item(
                    Key={'username': username}
                )
    print('User Records retrieved: {} '.format(recordsTableResponse))
    if 'Item' in recordsTableResponse:
        records = recordsTableResponse['Item']['records']
        for record in records:
            record['imageUrl'] = create_presigned_url(record['imageKey'])
        return records
    else:
        return None
        

def lambda_handler(event, context):
    username = event["queryStringParameters"]["username"]
    baseCalories = int(calculateBaseCalories(username))
    records = retrieveUserRecords(username)
    print("Base Calories calculated for user: {}, {}".format(username, baseCalories))
    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Origin" : "*", # Required for CORS support to work
            "Access-Control-Allow-Credentials" : True # Required for cookies, authorization headers with HTTPS
        },
        'body': json.dumps({"baseCalories": baseCalories, "records": records})
    }
