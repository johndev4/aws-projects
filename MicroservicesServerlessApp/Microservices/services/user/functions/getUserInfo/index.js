"use strict";

const { extractUserDetails } = require("../../lib/helpers/auth");
const { handleSuccess, handleError } = require("../../lib/helpers/response");
const { getUserInfo } = require("../../lib/services/user");
const config = require("../../lib/utils/config");

module.exports.handler = async (event) => {
  console.log("Get User Info : Start");

  try {
    console.log("Event:", JSON.stringify(event));

    const userDetails = extractUserDetails(event);
    console.log("User Details:", userDetails);

    // const data = typeof event.body === "string" ? JSON.parse(event.body) : event.body || null;
    // if (!data?.username) return handleError("Bad request", 400);

    const result = userDetails ? await getUserInfo(userDetails.username) : null;

    if (result) return handleSuccess({ result });
    return handleError("Something went wrong", 500);
  } catch (err) {
    console.error(err);
    return handleError("Internal server error");
  }
};
