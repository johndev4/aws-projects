const { DbConfig } = require("../db/config");
const { GET_EMPLOYEE_BY_ID } = require("../queries/employee");

async function getEmployeeById(id) {
  const dbConfig = new DbConfig();
  await dbConfig.init();
  const client = dbConfig.getClient();

  const queryResult = await client.query(GET_EMPLOYEE_BY_ID, [id]);

  if (queryResult) {
    console.log("Get employee by ID:", queryResult);
    if (queryResult.rowCount > 0) return queryResult.rows[0];
    return [];
  }

  throw "Error in getting employee by id";
}

module.exports = { getEmployeeById };
