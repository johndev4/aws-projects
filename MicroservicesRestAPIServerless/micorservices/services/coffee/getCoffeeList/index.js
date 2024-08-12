"use strict";

const { getDdbItemList } = require("../lib/helper/awsDDBHelper");
const { handleSuccess, handleError } = require("../lib/helper/responseHelper");
const config = require("../lib/utils/config");

module.exports.handler = async (event) => {
  console.log("Get Coffee List : Start");

  try {
    console.log("Event:", JSON.stringify(event, null, 2));

    let result = null;
    result = await getDdbItemList(`${config.project_name}-${config.stage}-Coffee`);

    return handleSuccess({ result });
  } catch (err) {
    return handleError(err.message);
  }
};
