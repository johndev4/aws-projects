const {
  KMSClient,
  GetPublicKeyCommand,
  DecryptCommand,
} = require("@aws-sdk/client-kms");
const { formatPem } = require("../utils/base64Util");
const config = require("../utils/config");

const kmsClient = new KMSClient({ region: config.region });

const getKmsPublicKey = async (keyId) => {
  if (!keyId) return null;

  try {
    console.log("Fetching KMS public key for KeyId:", keyId);

    const getPublicKeyCommand = new GetPublicKeyCommand({ KeyId: keyId });
    const response = await kmsClient.send(getPublicKeyCommand);

    const base64PublicKey = Buffer.from(response.PublicKey).toString("base64");

    const pemKey = formatPem(base64PublicKey);
    return pemKey;
  } catch (error) {
    console.error("Error getting KMS public key:", error);
    throw error;
  }
};

const kmsDecrypt = async (encryptedData, keyId) => {
  if (!encryptedData) return null;

  try {
    console.log("Decrypting data using KMS...");

    // Decode the base64 encoded ciphertext
    const encryptedBuffer = Buffer.from(encryptedData, "base64");

    // Use AWS KMS to decrypt
    const decryptCommand = new DecryptCommand({
      CiphertextBlob: encryptedBuffer,
      KeyId: keyId,
      EncryptionAlgorithm: "RSAES_OAEP_SHA_256",
    });
    const response = await kmsClient.send(decryptCommand);

    return response.Plaintext;
  } catch (error) {
    console.error("Error decrypting data:", error);
    throw error;
  }
};

module.exports = {
  getKmsPublicKey,
  kmsDecrypt,
};
