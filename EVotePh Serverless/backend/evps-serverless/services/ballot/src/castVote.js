const { getUserDetails } = require("./lib/commons/claims");
const { handleError, handleSuccess } = require("./lib/commons/response");

module.exports.handler = async (event) => {
  console.log(`Put Casted Votes : START`);
  console.log(`Event:`, JSON.stringify(event, null, 2));

  try {
    const data =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    console.log(`Data:`, JSON.stringify(data));

    const userDetails = getUserDetails(event);
    console.log(`User Details:`, userDetails);

    if (!userDetails) return handleError(401);

    let result = null;

    if (data) {
      result = {};
    }

    console.log("Response:", JSON.stringify(result));

    if (!result) return handleError(400);
    return handleSuccess(200);
  } catch (error) {
    console.log("Response:", error);
    return handleError(500);
  }
};
