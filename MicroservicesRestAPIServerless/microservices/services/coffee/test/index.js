"use strict";

const { handleSuccess, handleError } = require("../lib/helpers/response");
const config = require("../lib/utils/config");

module.exports.handler = async (event) => {
  console.log("Test Fn : Start");

  try {
    console.log("Event:", JSON.stringify(event, null, 2));
    let result = null;

    result = { ...config };

    return handleSuccess({ result });
  } catch (err) {
    return handleError(err.message);
  }
};
