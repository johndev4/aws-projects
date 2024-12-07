const Pool = require("pg").Pool;
const types = require("pg").types;
const config = require("../utils/config");
const { getRDSIAMAuthToken } = require("./rds-proxy-iamauth");

types.setTypeParser(types.builtins.TIMESTAMPTZ, function (stringValue) {
  return new Date(Date.parse(`${stringValue}-400`));
});

class DbConfig {
  constructor() {
    this._token = null;
    this._pool = null;
    this._client = null;
    this._clientInstance = null;
  }

  async init() {
    this._token = await getRDSIAMAuthToken();
    this._pool = new Pool({
      host: config.db.proxy_host,
      database: config.db.database,
      password: this._token,
      port: config.db.port,
      ssl: { rejectUnauthorized: false },
      idleTimeoutMillis: 10000,
    });

    this._pool.on("remove", (c) => {
      console.log("Client removed.");
    });

    this._pool.on("acquire", (c) => {
      console.log("Client acquired.");
    });

    this._pool.on("error", (err, c) => {
      console.log("Error: ", err);
    });

    this._client = {
      pool() {
        if (this._clientInstance) {
          return this._clientInstance;
        }
        return this._pool;
      },
      releaseClient() {
        if (this._clientInstance) {
          this._clientInstance.release();
          console.log("Client released.");
        }
        this._clientInstance = null;
      },
      /**
       *
       * @param {string} queryString
       * @param {Array} params
       * @returns {Promise<{ rowCount: number, rows: Array }>}
       */
      query: async (queryString, params = []) => {
        if (!this._clientInstance) {
          console.log("Client initializing...");
          this._clientInstance = await this._pool.connect().catch((err) => {
            console.log("Initialization error: ", err);
          });
          console.log("Client initialized.");
        }
        return await this._clientInstance
          .query(queryString, params)
          .then((res) => {
            return { rowCount: res.rowCount, rows: res.rows };
          })
          .catch((err) => {
            console.log("Error: ", err);
          });
      },
      showClientStatus() {
        console.log("Total count: ", this._pool.totalCount);
        console.log("Idle count: ", this._pool.idleCount);
        console.log("Waiting count: ", this._pool.waitingCount);
      },
    };
  }

  getClient() {
    return this._client;
  }

  getPool() {
    return this._pool;
  }
}

module.exports = { DbConfig };
