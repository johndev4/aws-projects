const { DbConfig } = require("../db/config");
const { GET_EMPLOYEE_ID_BY_EMAIL } = require("../queries/employee");

async function getEmployeeIdByEmail(email) {
  const dbConfig = new DbConfig();
  await dbConfig.init();
  const client = dbConfig.getClient();

  const queryResult = await client.query(GET_EMPLOYEE_ID_BY_EMAIL, [email]);

  if (queryResult) {
    console.log("Get employee by ID:", queryResult);
    if (queryResult.rowCount > 0) return queryResult.rows[0].id;
    return null;
  }

  throw "Error in getting employee by id";
}

module.exports = { getEmployeeIdByEmail };
