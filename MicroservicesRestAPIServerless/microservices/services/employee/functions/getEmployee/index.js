"use strict";

const { extractUserDetails } = require("../../lib/helpers/auth");
const { handleError, handleSuccess } = require("../../lib/helpers/response");
const { getEmployeeById } = require("../../lib/services/employee");

module.exports.handler = async (event) => {
  console.log("Get Employee : Start");

  try {
    console.log("Event:", JSON.stringify(event));

    const userDetails = extractUserDetails(event);
    console.log("userDetails: ", userDetails);

    const { id } = event.pathParameters || {};

    if (!id) return handleError("Invalid parameters", 400);

    const result = await getEmployeeById(id);

    if (result) {
      console.log(`Response Data:`, JSON.stringify(result));
      return handleSuccess({ result });
    }

    return handleError("Something went wrong.", 500);
  } catch (err) {
    return handleError(err.message);
  }
};
