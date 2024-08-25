export const environment = {
  production: false,
  stage: "dev",
  cognito: {
    PoolId: process.env["COGNITO_POOL_ID"],
    ClientId: process.env["COGNITO_CLIENT_ID"],
    ClientSecret: process.env["COGNITO_CLIENT_SECRET"],
    ClientDomain: process.env["COGNITO_CLIENT_DOMAIN"],
    ClientRedirectUri: process.env["COGNITO_CLIENT_REDIRECT_URI"],
    LoginUrl: process.env["COGNITO_LOGIN_URL"],
    LogoutUrl: process.env["COGNITO_LOGOUT_URL"],
  },
};
