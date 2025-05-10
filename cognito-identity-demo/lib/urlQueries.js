module.exports.getAllQueries = (url) => {
  const myUrl = new URL(url); // Parses the URL
  const queryParams = new URLSearchParams(myUrl.hash.substring(1)); // Extracts the query from the hash part

  const queryObject = {};
  for (const [key, value] of queryParams) {
    queryObject[key] = value; // Populates the object with key-value pairs
  }

  return queryObject;
};
