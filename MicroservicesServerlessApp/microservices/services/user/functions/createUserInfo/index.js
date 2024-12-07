"use strict";

const { extractUserAttributes } = require("../../lib/helpers/auth");
const { insertDdbItem } = require("../../lib/helpers/awsDdb");
const { insertUserInfo } = require("../../lib/services/user");
const config = require("../../lib/utils/config");

module.exports.handler = async (event, context) => {
  console.log("Create User Info : Start");

  try {
    console.log("Event:", JSON.stringify(event));

    const userAttributes = extractUserAttributes(event);
    console.log("User Attributes:", userAttributes);

    const insertResult = userAttributes ? await insertUserInfo(userAttributes) : {};
    if (insertResult.id) {
      const domain = userAttributes.email.split("@")?.[1] ?? null;
      if (domain === "mycloudorg.com") {
        event.response.autoConfirmUser = true;
        event.response.autoVerifyEmail = true;
      }

      await insertDdbItem(`${config.project_name}-${config.stage}-UserAttributesDynamoDBTable`, {
        id: userAttributes.username,
        groups: [],
        roles: [],
      });
    } else {
      console.error(`Something went wrong with inserting user info.`);
      context.fail(event);
    }

    context.succeed(event);
  } catch (err) {
    console.error(err);
    context.fail(event);
  }
};
