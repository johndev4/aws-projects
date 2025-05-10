const {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const {
  fromCognitoIdentityPool,
} = require("@aws-sdk/credential-provider-cognito-identity");
const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
const { getAllQueries } = require("./lib/urlQueries");

const AWS_REGION = "ap-southeast-1";
const S3_BUCKET_NAME = "demo-johndev1898-s3-cognito-users-storage";
const IDENTITY_POOL_ID = "ap-southeast-1:051f3044-673e-46b8-bef6-a62eac9f64c6";

const urlQueries = getAllQueries("http://localhost:3000/auth#id_token=");

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

// Create S3 client with temporary credentials
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: credentials,
});

async function listUserObjects() {
  try {
    // Get the identity ID to construct the folder prefix
    const { identityId } = await s3Client.config.credentials();
    const userPrefix = `private/user/${identityId}/`; // This creates the user-specific folder prefix

    // Example file content - replace with actual file data
    const fileContent = "Hello World!";

    // await new Promise((resolve, reject) => {
    //   try {
    //     const command = new PutObjectCommand({
    //       Bucket: S3_BUCKET_NAME,
    //       Key: `${userPrefix}example.txt`,
    //       Body: fileContent,
    //       ContentType: "text/plain",
    //     });

    //     s3Client.send(command).then((response) => resolve(response));
    //   } catch (error) {
    //     reject(error);
    //   }
    // });

    const response = await new Promise((resolve, reject) => {
      try {
        const command = new ListObjectsV2Command({
          Bucket: S3_BUCKET_NAME,
          Prefix: userPrefix,
          MaxKeys: 100, // Adjust as needed
        });

        s3Client.send(command).then((response) => resolve(response));
      } catch (error) {
        reject(error);
      }
    });

    // Process the results
    if (response.Contents) {
      console.log("Objects in user folder:");
      response.Contents.forEach((item) => {
        console.log(`- ${item.Key} (${item.Size} bytes)`);
      });
    } else {
      console.log("No objects found in user folder");
    }

    return response.Contents;
  } catch (error) {
    console.error("Error listing objects:", error);
    throw error;
  }
}

// Execute the function
listUserObjects().catch(console.error);
