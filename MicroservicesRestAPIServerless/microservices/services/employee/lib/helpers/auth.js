const extractUserDetails = (event = {}) => {
  if (event.requestContext?.authorizer?.claims) {
    const claims = event.requestContext.authorizer.claims;
    return { username: claims.username };
  }
  return null;
};

module.exports = { extractUserDetails };
