const {
  fromCognitoIdentityPool,
} = require("@aws-sdk/credential-provider-cognito-identity");
const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
const { getAllQueries } = require("./lib/urlQueries");
const {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} = require("@aws-sdk/client-dynamodb");

const AWS_REGION = "ap-southeast-1";
const TABLE_NAME = "demo-johndev1898-ddb-cognito-users";
const IDENTITY_POOL_ID = "ap-southeast-1:051f3044-673e-46b8-bef6-a62eac9f64c6";

const urlQueries = getAllQueries("http://localhost:3000/auth#id_token=");
console.log("urlQueries:", urlQueries);

// Configure the credentials provider
const credentials = fromCognitoIdentityPool({
  client: new CognitoIdentityClient({ region: AWS_REGION }),
  identityPoolId: IDENTITY_POOL_ID,
  // If you have authenticated users, include these
  logins: {
    "cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_WZNbVRLf1":
      urlQueries.id_token,
  },
});

// Create Dynamo client with temporary credentials
const dynamoClient = new DynamoDBClient({
  region: AWS_REGION,
  credentials: credentials,
});

async function listUserDdbItem() {
  try {
    const { identityId } = await dynamoClient.config.credentials();
    console.log("identityId:", identityId);
    console.log("credentials:", await credentials());

    const putCommand = new PutItemCommand({
      TableName: TABLE_NAME,
      Item: {
        id: { S: identityId },
        sub_id: { S: "1" },
        createdAt: { S: new Date().toISOString() },
      },
    });
    await dynamoClient.send(putCommand);

    // const getCommand = new GetItemCommand({
    //   TableName: TABLE_NAME,
    //   Key: {
    //     id: { S: identityId },
    //   },
    // });
    // const result = await dynamoClient.send(getCommand);
    // console.log(result.Item);
  } catch (error) {
    console.error("Error listing objects:", error);
    throw error;
  }
}

// Execute the function
listUserDdbItem().catch(console.error);
