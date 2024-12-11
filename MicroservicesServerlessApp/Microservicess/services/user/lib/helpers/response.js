let headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

/**
 *
 * @param {string} body
 * @param {number} status
 * @param {{customHeaders}} options
 * @returns
 */
function handleSuccess(body, statusCode, options = {}) {
  const responseBody = JSON.stringify({ message: body ?? "Success" }, null, 2);
  console.log(`Response Body: ${responseBody}`);
  return {
    statusCode: statusCode ?? 200,
    body: responseBody,
    headers: { ...headers, ...(options?.["customHeaders"] ?? {}) },
  };
}

/**
 *
 * @param {string} body
 * @param {number} status
 * @param {{customHeaders}} options
 * @returns
 */
function handleError(body, statusCode, options = {}) {
  const responseBody = JSON.stringify({ message: body ?? "Internal Server Error" }, null, 2);
  console.log(`Response Body: ${responseBody}`);
  return {
    statusCode: statusCode ?? 500,
    body: responseBody,
    headers: { ...headers, ...(options?.["customHeaders"] ?? {}) },
  };
}

module.exports = { handleSuccess, handleError };
