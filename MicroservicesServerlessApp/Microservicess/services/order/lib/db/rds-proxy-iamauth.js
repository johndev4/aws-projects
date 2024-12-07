const { RDS } = require("@aws-sdk/client-rds");
const { Signer } = require("@aws-sdk/rds-signer");
const config = require("../utils/config");

async function getRDSIAMAuthToken() {
  try {
    console.log("Getting RDS IAM Auth Token...");

    const signer = new Signer({
      region: config.region,
      hostname: config.db.proxy_host,
      port: parseInt(config.db.port, 10),
      username: config.db.user,
    });

    const token = await signer.getAuthToken();
    // ({
    //   username: config.db.user,
    // });

    console.log("IAM Token obtained.");
    return token;
  } catch (error) {
    console.error("IAM Auth failed.");
    throw error;
  }
}

module.exports = { getRDSIAMAuthToken };
