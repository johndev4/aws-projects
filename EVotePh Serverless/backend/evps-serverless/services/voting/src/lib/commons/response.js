// const statusMessages = {
//   200: "OK",
//   201: "Created",
//   204: "No Content",
//   400: "Bad Request",
//   401: "Unauthorized",
//   403: "Forbidden",
//   404: "Not Found",
//   409: "Conflict",
//   422: "Unprocessable Entity",
//   500: "Internal Server Error",
//   502: "Bad Gateway",
//   503: "Service Unavailable",
// };

const successStatusMessages = {
  200: "Request completed successfully",
  201: "Resource was successfully created",
  204: "Request successful, no content to return",
};
const errorStatusMessages = {
  400: "Invalid request parameters or format",
  401: "Authentication required - please log in",
  403: "You do not have permission to access this resource",
  404: "The requested resource could not be found",
  409: "Request conflicts with existing resource",
  422: "Request data failed validation",
  500: "Server encountered an error processing request",
  502: "Unable to get valid response from upstream server",
  503: "Service temporarily unavailable - please try again later",
};

// Success handler
function handleSuccess(statusCode = 200, body = null, headers = {}) {
  const message = successStatusMessages[statusCode] || "Success";
  statusCode = successStatusMessages[statusCode] ? statusCode : 200;

  return {
    statusCode,
    headers: {
      // Required for CORS support to work
      "Access-Control-Allow-Origin": "*",
      // Required for cookies, authorization headers with HTTPS
      "Access-Control-Allow-Credentials": true,
      ...headers,
    },
    body:
      typeof body === "string"
        ? body
        : JSON.stringify(
            body || {
              success: true,
              message,
            }
          ),
  };
}

// Error handler
function handleError(statusCode = 500, body = null, headers = {}) {
  const message = errorStatusMessages[statusCode] || "Error";
  statusCode = errorStatusMessages[statusCode] ? statusCode : 500;

  return {
    statusCode,
    headers: {
      // Required for CORS support to work
      "Access-Control-Allow-Origin": "*",
      // Required for cookies, authorization headers with HTTPS
      "Access-Control-Allow-Credentials": true,
      ...headers,
    },
    body:
      typeof body === "string"
        ? body
        : JSON.stringify(
            body || {
              success: false,
              message,
            }
          ),
  };
}

module.exports = {
  handleSuccess,
  handleError,
};
