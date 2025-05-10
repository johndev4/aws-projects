import {
  STSClient,
  AssumeRoleWithWebIdentityCommand,
} from "@aws-sdk/client-sts";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const AWS_REGION = "ap-southeast-1";
const AUTH_ROLE_ARN =
  "arn:aws:iam::036003563447:role/service-role/demoCipAuthRole";
const S3_BUCKET_NAME = "demo-johndev1898-s3-cognito-users-storage";

export const handler = async (event) => {
  console.log("Event:", event);

  try {
    const idToken = event.headers.Authorization.replace("Bearer ", "");
    console.log("idToken:", idToken);

    const stsClient = new STSClient({ region: AWS_REGION });

    const assumeRoleCommand = new AssumeRoleWithWebIdentityCommand({
      RoleArn: AUTH_ROLE_ARN,
      RoleSessionName: "userSession",
      WebIdentityToken: idToken,
    });

    const creds = await stsClient.send(assumeRoleCommand);
    console.log("creds:", creds);

    /*
ERROR	Error: AccessDenied: Not authorized to perform sts:AssumeRoleWithWebIdentity
at throwDefaultError (/var/task/node_modules/@smithy/smithy-client/dist-cjs/index.js:867:20)
at /var/task/node_modules/@smithy/smithy-client/dist-cjs/index.js:876:5
at de_CommandError (/var/task/node_modules/@aws-sdk/client-sts/dist-cjs/index.js:514:14)
at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
at async /var/task/node_modules/@smithy/middleware-serde/dist-cjs/index.js:35:20
at async /var/task/node_modules/@smithy/core/dist-cjs/index.js:193:18
at async /var/task/node_modules/@smithy/middleware-retry/dist-cjs/index.js:320:38
at async /var/task/node_modules/@aws-sdk/middleware-logger/dist-cjs/index.js:33:22
at async Runtime.handler (file:///var/task/index.mjs:31:19) {
'$fault': 'client',
'$metadata': {
httpStatusCode: 403,
requestId: 'dc3c0523-01cc-4fb8-819a-6e490a24d38b',
extendedRequestId: undefined,
cfId: undefined,
attempts: 1,
totalRetryDelay: 0
},
Type: 'Sender',
Code: 'AccessDenied'
}
 */

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Go Serverless v4! Your function executed successfully!",
      }),
    };

    const s3 = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: creds.Credentials.AccessKeyId,
        secretAccessKey: creds.Credentials.SecretAccessKey,
        sessionToken: creds.Credentials.SessionToken,
      },
    });

    const { identityId } = await s3.config.credentials();
    const userPrefix = `private/user/${identityId}/`; // This creates the user-specific folder prefix

    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: `${userPrefix}example.txt`,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return {
      statusCode: 200,
      body: JSON.stringify({ signedUrl }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};

// exports.handler = async (event) => {
//   console.log("Event:", event);
//   return {
//     statusCode: 200,
//     body: JSON.stringify({
//       message: "Go Serverless v4! Your function executed successfully!",
//     }),
//   };
// };
