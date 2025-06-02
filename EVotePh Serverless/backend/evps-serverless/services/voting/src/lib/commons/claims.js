module.exports.extractUserDetails = (event) => {
  try {
    // Extract claims from requestContext.authorizer.claims
    const claims = event.requestContext?.authorizer?.claims ?? null;

    if (!claims) return null;

    // Get relevant user attributes from claims
    const userDetails = {
      userId: claims.sub,
      email: claims.email,
      username: claims.username || claims["cognito:username"] || undefined,
      given_name: claims.given_name || undefined,
      middle_name: claims.middle_name || undefined,
      family_name: claims.family_name || undefined,
      address: claims.address || undefined,
      birthdate: claims.birthdate || undefined,
      gender: claims.gender || undefined,
      name: claims.name || undefined,
    };

    return userDetails;
  } catch (error) {
    console.error("Error getting user info from claims:", error);
    throw new Error("Unable to get user information");
  }
};
