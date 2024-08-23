"use strict";

const { extractUserDetails } = require("../../lib/helpers/auth");
const { getDdbItem } = require("../../lib/helpers/awsDdb");
const { handleSuccess, handleError } = require("../../lib/helpers/response");
const config = require("../../lib/utils/config");

module.exports.handler = async (event) => {
  console.log("Get Coffee : Start");

  try {
    console.log("Event:", JSON.stringify(event, null, 2));

    const userDetails = extractUserDetails(event);
    console.log("userDetails: ", userDetails);

    const { id } = event.pathParameters || {};

    if (!id) {
      return handleError("Invalid parameters", 400);
    }

    let result = null;
    result = await getDdbItem(`${config.project_name}-${config.stage}-Coffee`, id);

    return handleSuccess({ result });
  } catch (err) {
    return handleError(err.message);
  }
};
