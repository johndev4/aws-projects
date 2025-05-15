const { extractUserDetails } = require("./lib/commons/claims");
const { handleError, handleSuccess } = require("./lib/commons/response");
const { getKmsPublicKey } = require("./lib/helpers/awsKmsHelper");
const config = require("./lib/utils/config");

module.exports.handler = async (event) => {
  console.log(`Get Encryption Public Key : START`);
  console.log(`Event:`, JSON.stringify(event, null, 2));

  try {
    const userDetails = extractUserDetails(event);
    console.log(`User Details:`, userDetails);

    if (!userDetails) return handleError(401);

    let pubKeyPem = await getKmsPublicKey(config.kmsKeyId);

    const result = pubKeyPem ? { pubKeyPem } : null;

    console.log("Response:", { result });

    if (!result) return handleError(400);
    return handleSuccess(200, result);
  } catch (error) {
    console.log("Response:", error);
    return handleError(500);
  }
};
