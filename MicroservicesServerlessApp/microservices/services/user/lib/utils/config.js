module.exports = {
  project_name: process.env.PROJECT_NAME,
  stage: process.env.STAGE,
  region: process.env.REGION,
  is_offline: process.env.IS_OFFLINE,
  db: {
    proxy_host: process.env.PGPROXY_ENDPOINT,
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  },
};
