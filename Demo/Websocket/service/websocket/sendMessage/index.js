const {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} = require("@aws-sdk/client-apigatewaymanagementapi");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");

const connectionsUrl = `https://${process.env.WS_APIGW_ID}.execute-api.${process.env.REGION}.amazonaws.com/${process.env.STAGE}`;
console.log("connectionsUrl:", connectionsUrl);
const apiClient = new ApiGatewayManagementApiClient({
  endpoint: connectionsUrl,
});

const dbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dbClient);

module.exports.handler = async (event) => {
  console.log("Event:", JSON.stringify(event));

  try {
    const { connectionId } = event.requestContext;
    const data = JSON.parse(event.body);
    const recepientId = data.recepientId || "anonymous";
    const message = data.message || "Empty message.";

    const socketConnections = await docClient.send(
      new QueryCommand({
        TableName: process.env.WS_CONNECTIONS_TABLE,
        IndexName: "userId-index",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": recepientId,
        },
      })
    );
    console.log("Socket Connections:", JSON.stringify(socketConnections));

    if (socketConnections.Items && socketConnections.Items.length > 0) {
      await Promise.all(
        socketConnections.Items.map(async (socketConn) => {
          const command = new PostToConnectionCommand({
            ConnectionId: socketConn.connectionId,
            Data: JSON.stringify({ message }),
          });
          await apiClient.send(command);
        })
      );
    }

    const command = new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: "Message sent!",
    });
    await apiClient.send(command);

    return { statusCode: 200 };
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
