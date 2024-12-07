function extractUserDetails(event = {}) {
  if (event.requestContext?.authorizer?.claims) {
    const claims = event.requestContext.authorizer.claims;
    return { username: claims.username };
  }
  return null;
}

function extractUserAttributes(event = {}) {
  if (event.userName && event.request?.userAttributes) {
    const userAttributes = event.request.userAttributes;
    return { username: userAttributes.sub || event.userName, ...userAttributes };
  }

  return null;
}

module.exports = { extractUserDetails, extractUserAttributes };
