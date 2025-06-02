const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const config = require("../utils/config");

const client = new DynamoDBClient({
  region: config.region,
});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const putDynamoTableItem = async (tableName, data) => {
  console.log("Put DynamoDB Table Item:", data);
  try {
    const putCommand = new PutCommand({
      TableName: tableName,
      Item: data,
    });

    return await ddbDocClient.send(putCommand);
  } catch (error) {
    console.error("Error putting DynamoDB table item:", error);
    throw error;
  }
};

const queryDynamoTableById = async (tableName, idKeyValue) => {
  console.log(`Querying ${tableName} by partition ID:`, idKeyValue);
  try {
    let KeyConditionExpression;
    let ExpressionAttributeValues = {};
    Object.keys(idKeyValue).forEach((key) => {
      KeyConditionExpression = `${key} = :partid`;
      ExpressionAttributeValues[":partid"] = idKeyValue[key];
    });

    if (
      !KeyConditionExpression ||
      Object.keys(ExpressionAttributeValues).length === 0
    ) {
      throw new Error("Invalid idKeyValue");
    }

    const queryCommand = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression,
      ExpressionAttributeValues,
    });

    const result = await ddbDocClient.send(queryCommand);
    return result?.Items ?? [];
  } catch (error) {
    console.error("Error querying user ballots:", error);
    throw error;
  }
};
// const getDynamoTableItemsById = async (tableName, idKeyValue) => {
//   console.log("Get DynamoDB Table Item by ID:", idKeyValue);
//   try {
//     if (!idKeyValue || Object.keys(idKeyValue).length === 0) {
//       throw new Error("Invalid idKeyValue");
//     }

//     const getCommand = new GetCommand({
//       TableName: tableName,
//       Key: idKeyValue,
//     });

//     const item = await ddbDocClient.send(getCommand);

//     return item?.Item;
//   } catch (error) {
//     console.error("Error getting DynamoDB table item:", error);
//     throw error;
//   }
// };

module.exports = {
  putDynamoTableItem,
  queryDynamoTableById,
};
