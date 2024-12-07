const { DbConfig } = require("../db/config");
const dbConfig = new DbConfig();
const { INSERT_USER_INFO, GET_USER_INFO_BY_USERNAME } = require("../queries/user");

async function insertUserInfo(params) {
  try {
    await dbConfig.init();
    const client = dbConfig.getClient();

    console.log("Begin transaction.");
    await client.query("BEGIN");

    const result = await client.query(
      INSERT_USER_INFO,
      Object.values({
        username: params.username,
        first_name: null,
        last_name: null,
        email: params.email,
        phone_number: null,
        date_of_birth: null,
        street: null,
        barangay: null,
        city: null,
        municipality: null,
        country: null,
      })
    );
    console.log(`Insert user info.`, result);

    if (result && result.rowCount > 0) {
      console.log("Transaction commit.");
      await client.query("COMMIT");

      return result.rows[0];
    }

    console.log("Transaction rollback.");
    await client.query("ROLBACK");
    return null;
  } catch (error) {
    console.log("Transaction rollback.");
    await client.query("ROLBACK");
    throw error;
  }
}

async function getUserInfo(username = "") {
  if (!username || username == "") return null;

  await dbConfig.init();
  const client = dbConfig.getClient();

  const result = await client.query(GET_USER_INFO_BY_USERNAME, [username]);
  console.log(`Get user info.`, result);

  return result && result.rowCount > 0 ? result.rows[0] : null;
}

module.exports = { insertUserInfo, getUserInfo };
