"use strict";

const { getDdbItemList } = require("../../lib/helpers/awsDdb");
const { extractUserDetails } = require("../../lib/helpers/auth");
const { handleSuccess, handleError } = require("../../lib/helpers/response");
const config = require("../../lib/utils/config");

module.exports.handler = async (event) => {
  console.log("Get Coffee List : Start");

  try {
    console.log("Event:", JSON.stringify(event, null, 2));

    const userDetails = extractUserDetails(event);
    console.log("userDetails: ", userDetails);

    let result = null;
    result = await getDdbItemList(`${config.project_name}-${config.stage}-Coffee`);

    return handleSuccess({ result });
  } catch (err) {
    return handleError(err.message);
  }
};
