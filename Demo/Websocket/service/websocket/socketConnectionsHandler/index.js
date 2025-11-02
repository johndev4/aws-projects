const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

module.exports.handler = async (event) => {
  console.log("Event:", JSON.stringify(event));

  const routeKey = event.requestContext.routeKey;
  switch (routeKey) {
    case "$connect":
      return await handleConnect(event);
    case "$disconnect":
      return await handleDisconnect(event);
    case "$default":
      return await handleDefault(event);
  }
  return { statusCode: 404 };
};

async function handleConnect(event) {
  try {
    const { connectionId } = event.requestContext;
    const userId = event.queryStringParameters?.userId || "anonymous";

    await docClient.send(
      new PutCommand({
        TableName: process.env.WS_CONNECTIONS_TABLE,
        Item: {
          connectionId,
          userId,
          ttl: Math.floor(Date.now() / 1000) + 3600,
        },
      })
    );

    console.log("Connection inserted:", connectionId);
    return { statusCode: 200 };
  } catch (error) {
    console.error("Error inserting connection:", error);
    throw error;
  }
}

async function handleDisconnect(event) {
  try {
    const { connectionId } = event.requestContext;

    await docClient.send(
      new DeleteCommand({
        TableName: process.env.WS_CONNECTIONS_TABLE,
        Key: { connectionId },
      })
    );

    console.log("Connection deleted:", connectionId);
    return { statusCode: 200 };
  } catch (error) {
    console.error("Error deleting connection:", error);
    return { statusCode: 500 };
  }
}

async function handleDefault(event) {
  console.log("Default route:", event);
  return { statusCode: 500 };
}
