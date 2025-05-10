module.exports.getUserDetails = (event) => {
  try {
    // Extract claims from requestContext.authorizer.claims
    const claims = event.requestContext?.authorizer?.claims ?? null;

    if (!claims) return null;

    // Get relevant user attributes from claims
    const userDetails = {
      userId: claims.sub,
      email: claims.email,
      username: claims.username || claims["cognito:username"] || null,
      given_name: claims.given_name || null,
      middle_name: claims.middle_name || null,
      family_name: claims.family_name || null,
      address: claims.address || null,
      birthdate: claims.birthdate || null,
      gender: claims.gender || null,
      name: claims.name || null,
    };

    return userDetails;
  } catch (error) {
    console.error("Error getting user info from claims:", error);
    throw new Error("Unable to get user information");
  }
};
