"use strict";

const { getDdbItemList } = require("../lib/helper/awsDDBHelper");
const { extractUserDetails } = require("../lib/helper/auth");
const { handleSuccess, handleError } = require("../lib/helper/responseHelper");
const config = require("../lib/utils/config");

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
