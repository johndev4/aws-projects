const crypto = require("crypto");
const { base64ToArrayBuffer } = require("../utils/base64Util");

const verifySignature = async (content, signature, signerPubKeyPem) => {
  try {
    const contentBuff = new TextEncoder().encode(content);

    const sigBuff = base64ToArrayBuffer(signature);

    // Clean public key PEM by removing headers and whitespace
    const signerPubKey = signerPubKeyPem
      .replace(/-----.*?-----/g, "") // Remove PEM headers
      .replace(/\s/g, ""); // Remove all whitespace

    const pubKeyBuff = base64ToArrayBuffer(signerPubKey);

    // Import the public key for verification
    const publicKey = await crypto.subtle.importKey(
      "spki",
      pubKeyBuff,
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      false,
      ["verify"]
    );

    // Verify the signature using ECDSA with SHA-256
    const isValid = await crypto.subtle.verify(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      publicKey,
      sigBuff,
      contentBuff
    );

    return isValid;
  } catch (error) {
    console.error("Error verifying signature:", error);
    throw error;
  }
};

const decrypt = async (content, aesKey, iv) => {
  try {
    const data = Buffer.from(content, "base64");
    const authTag = data.slice(data.length - 16); // Last 16 bytes
    const encrypted = data.slice(0, data.length - 16);

    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      aesKey,
      Buffer.from(iv, "base64")
    );
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted;
  } catch (error) {
    console.error("Error decrypting content:", error.message);
    throw error;
  }
};

const generateSHA256Hash = (content) =>
  crypto.createHash("sha256").update(content).digest("hex");

module.exports = { verifySignature, decrypt, generateSHA256Hash };
