"use strict";

const { extractUserDetails } = require("../lib/helper/auth");
const { updateDdbItem } = require("../lib/helper/awsDDBHelper");
const { handleSuccess, handleError } = require("../lib/helper/responseHelper");
const config = require("../lib/utils/config");

module.exports.handler = async (event) => {
  console.log("Update Coffee : Start");

  try {
    console.log("Event:", JSON.stringify(event, null, 2));

    const userDetails = extractUserDetails(event);
    console.log("userDetails: ", userDetails);

    const { id } = event.pathParameters || {};
    const data = typeof event.body === "string" ? JSON.parse(event.body) : event.body || null;

    if (!id || !data) {
      return handleError("Invalid parameters", 400);
    }

    let result = null;
    result = await updateDdbItem(`${config.project_name}-${config.stage}-Coffee`, id, data);

    return handleSuccess({ result });
  } catch (err) {
    return handleError(err.message);
  }
};
