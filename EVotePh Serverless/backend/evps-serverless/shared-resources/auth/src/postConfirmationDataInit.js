const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { senatorialCandidates } = require("./lib/commons/senatorial_candidates");
const { bcryptHashContent } = require("./lib/commons/helper");

const AWS_REGION = "ap-southeast-1";

const client = new DynamoDBClient({ region: AWS_REGION });
const dynamodb = DynamoDBDocumentClient.from(client);

module.exports.handler = async (event) => {
  console.info("Post Confirmation Data Initialization : Start");
  console.info("Event:", event);

  // // Extract user attributes from Cognito event
  // const {
  //   userName,
  //   request: { userAttributes },
  // } = event;

  // // Check if email is verified
  // if (!userAttributes.email_verified) {
  //   console.error("Email is not verified");
  //   throw new Error("Email verification required before proceeding");
  // }

  // // Log user signup details
  // console.info("User signup details:", {
  //   username: userName,
  //   email: userAttributes.email,
  // });

  // const ballotHash = await bcryptHashContent(
  //   `${userName}_${userAttributes.email}`
  // );
  // const ballotsParams = {
  //   TableName: process.env.USER_BALLOTS_TABLE_NAME,
  //   Item: {
  //     ballot_id: ballotHash,
  //     user_email: userAttributes.email,
  //     senatorial_cadidates: senatorialCandidates,
  //     created_at: Math.floor(Date.now() / 1000),
  //   },
  // };

  // try {
  //   await dynamodb.send(new PutCommand(ballotsParams));
  //   console.log("Ballot info created successfully:", ballotsParams.Item);
  // } catch (error) {
  //   console.error("Error creating ballot info:", error);
  //   throw error;
  // }

  // Allow user signup to proceed
  return event;
};
