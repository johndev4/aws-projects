const { KMSClient, GetPublicKeyCommand } = require("@aws-sdk/client-kms");

const getKmsPublicKey = async (keyId) => {
  if (!keyId) return null;

  const kms = new KMSClient();

  try {
    console.log("Fetching KMS public key for KeyId:", keyId);

    const response = await kms.send(new GetPublicKeyCommand({ KeyId: keyId }));
    const base64PublicKey = Buffer.from(response.PublicKey).toString("base64");

    const pemKey = formatPem(base64PublicKey);
    return pemKey;
  } catch (error) {
    console.error("Error getting KMS public key:", error);
    throw error;
  }
};

const formatPem = (base64Key) => {
  const lines = base64Key.match(/.{1,64}/g).join("\n");
  return `-----BEGIN PUBLIC KEY-----\n${lines}\n-----END PUBLIC KEY-----`;
};

module.exports = {
  getKmsPublicKey,
};
