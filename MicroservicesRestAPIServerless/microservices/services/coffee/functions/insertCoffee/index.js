"use strict";

const { extractUserDetails } = require("../../lib/helpers/auth");
const { insertDdbItem } = require("../../lib/helpers/awsDdb");
const { handleSuccess, handleError } = require("../../lib/helpers/response");
const { getEmployeeIdByEmail } = require("../../lib/services/employee");
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

    const employeeId = await getEmployeeIdByEmail(userDetails.username);
    if (employeeId) {
      result = await insertDdbItem(`${config.project_name}-${config.stage}-Coffees`, {
        ...data,
        transaction_by: employeeId,
      });
    }

    if (result) return handleSuccess({ result });
    return handleError("Something went wrong", 500);
  } catch (err) {
    return handleError(err.message);
  }
};
