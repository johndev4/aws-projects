const { extractUserDetails } = require("./lib/commons/claims");
const { handleError, handleSuccess } = require("./lib/commons/response");
const config = require("./lib/utils/config");
const { kmsDecrypt } = require("./lib/helpers/awsKmsHelper");
const {
  verifySignature,
  generateSHA256Hash,
  decrypt,
} = require("./lib/helpers/cryptosHelper");
const {
  putDynamoTableItem,
  queryDynamoTableById,
} = require("./lib/helpers/awsDynamoHelper");

module.exports.handler = async (event) => {
  console.log(`Put Casted Votes : START`);
  console.log(`Event:`, JSON.stringify(event, null, 2));

  try {
    const body =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    console.log(`Body:`, JSON.stringify(body));

    const userDetails = extractUserDetails(event);
    console.log(`User Details:`, userDetails);

    if (!userDetails) return handleError(401);

    const userBallot = await queryDynamoTableById(config.ballotsTableName, {
      user_id: userDetails.userId,
    });

    if (userBallot.length > 0) return handleError(409);

    let result = null;

    if (body) {
      const {
        encryptedContent,
        iv,
        encryptedAESKey,
        signature,
        signerPubKeyPem,
      } = body ?? {};

      const decryptedAESKey = await kmsDecrypt(
        encryptedAESKey,
        config.kmsKeyId
      );
      // console.log("Decrypted AES Key:", decryptedAESKey);

      const decryptedContent = await decrypt(
        encryptedContent,
        decryptedAESKey,
        iv
      );

      const ballotContent =
        typeof decryptedContent?.toString("utf8") === "string"
          ? JSON.parse(decryptedContent)
          : null;

      if (typeof ballotContent !== "object") return;

      const contentIsValid = await verifySignature(
        decryptedContent,
        signature,
        signerPubKeyPem
      );
      console.log("Ballot Content Validity?", contentIsValid);

      if (contentIsValid === true) {
        const ballotSHA256Hash = generateSHA256Hash(
          userDetails.userId + decryptedContent
        );

        await putDynamoTableItem(config.ballotsTableName, {
          user_id: userDetails.userId,
          ballot_id: ballotSHA256Hash,
          ...ballotContent,
        });

        result = { ballot_id: ballotSHA256Hash };
      } else {
        return handleError(422);
      }
    }

    console.log("Response:", JSON.stringify(result));

    if (!result) return handleError(400);
    return handleSuccess(200, {
      success: true,
      message: "Your vote has been submitted successfully",
      data: result,
    });
  } catch (error) {
    console.log("Response:", error);
    return handleError(500);
  }
};
