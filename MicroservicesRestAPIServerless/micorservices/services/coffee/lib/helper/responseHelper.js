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
  return {
    statusCode: statusCode ?? 200,
    body: JSON.stringify({ message: body ?? "Success" }),
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
  return {
    statusCode: statusCode ?? 500,
    body: JSON.stringify({ message: body ?? "Internal Server Error" }),
    headers: { ...headers, ...(options?.["customHeaders"] ?? {}) },
  };
}

module.exports = { handleSuccess, handleError };
