"use strict";

const { extractUserDetails } = require("../../lib/helpers/auth");
const { insertDdbItem } = require("../../lib/helpers/awsDdb");
const { handleSuccess, handleError } = require("../../lib/helpers/response");
const config = require("../../lib/utils/config");

module.exports.handler = async (event) => {
  console.log("Insert Coffee : Start");

  try {
    console.log("Event:", JSON.stringify(event, null, 2));

    const userDetails = extractUserDetails(event);
    console.log("userDetails: ", userDetails);

    const data = typeof event.body === "string" ? JSON.parse(event.body) : event.body || null;

    if (!data) {
      return handleError("Invalid parameters", 400);
    }

    let result = null;
    result = await insertDdbItem(`${config.project_name}-${config.stage}-Coffees`, data);

    return handleSuccess({ result });
  } catch (err) {
    return handleError(err.message);
  }
};
