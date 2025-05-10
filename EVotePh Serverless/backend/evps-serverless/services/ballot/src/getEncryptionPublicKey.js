const { getKmsPublicKey } = require("./lib/helper/awsKms");
const { getUserDetails } = require("./lib/commons/claims");
const { handleError, handleSuccess } = require("./lib/commons/response");

module.exports.handler = async (event) => {
  console.log(`Get Encryption Public Key : START`);
  console.log(`Event:`, JSON.stringify(event, null, 2));

  try {
    // const data =
    //   typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    // console.log(`Data:`, JSON.stringify(data));

    const userDetails = getUserDetails(event);
    console.log(`User Details:`, userDetails);

    if (!userDetails) return handleError(401);

    const kmsKeyId = process.env.KMS_KEY_ID;
    let keyPair = await getKmsPublicKey(kmsKeyId);

    console.log("Response:", keyPair);

    if (!keyPair) return handleError(400);
    return handleSuccess(200, {
      publicKey: keyPair,
    });
  } catch (error) {
    console.log("Response:", error);
    return handleError(500);
  }
};
