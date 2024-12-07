const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { v4: uuidv4 } = require("uuid");
const config = require("../utils/config");

const documentClient = DynamoDBDocument.from(
  new DynamoDB({
    region: config.region,
  })
);

/**
 *
 * @param {string} tableName
 * @param {*} item
 * @returns
 */
async function insertDdbItem(tableName, item) {
  try {
    const params = {
      TableName: tableName,
      Item: { ...item, id: item.id ?? uuidv4() },
    };

    const data = await documentClient.put(params);
    console.log("InsertDdbItem Result:", data);
    return "Item inserted successfully.";
  } catch (err) {
    console.error("Error inserting item");
    throw err;
  }
}

/**
 *
 * @param {string} tableName
 * @param {string} id
 * @returns
 */
async function getDdbItem(tableName, id) {
  try {
    const params = {
      TableName: tableName,
      Key: {
        id: id,
      },
    };

    const data = await documentClient.get(params);
    console.log("GetDdbItem Result:", data);
    return data.Item;
  } catch (err) {
    console.error("Error getting item");
    throw err;
  }
}

/**
 *
 * @param {string} tableName
 * @returns
 */
async function getDdbItemList(tableName) {
  try {
    const params = {
      TableName: tableName,
    };

    const data = await documentClient.scan(params);
    console.log("GetDdbItem Result:", data);
    return data.Items;
  } catch (err) {
    console.error("Error getting item");
    throw err;
  }
}

/**
 *
 * @param {string} tableName
 * @param {string} id
 * @param {*} item
 * @returns
 */
async function updateDdbItem(tableName, id, item) {
  try {
    let updateExpression = "";
    let expressionAttributeValues = {};
    Object.keys(item).forEach((key, i) => {
      updateExpression += i === 0 ? "set " : ",";
      updateExpression += `${key}=:${key}`;
      expressionAttributeValues[`:${key}`] = item[key];
    });

    const data = await documentClient.update({
      TableName: tableName,
      Key: {
        id: id,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });
    console.log("UpdateDdbItem Result:", data);
    return "Item updated successfully.";
  } catch (err) {
    console.error("Error getting item");
    throw err;
  }
}

/**
 *
 * @param {string} tableName
 * @param {string} id
 * @returns
 */
async function deleteDdbItem(tableName, id) {
  try {
    const data = await documentClient.delete({
      TableName: tableName,
      Key: {
        id: id,
      },
    });
    console.log("DeleteDdbItem Result:", data);
    return "Item deleted successfully.";
  } catch (err) {
    console.error("Error getting item");
    throw err;
  }
}

module.exports = { insertDdbItem, getDdbItem, getDdbItemList, updateDdbItem, deleteDdbItem };
