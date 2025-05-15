const bcrypt = require("bcryptjs");

/**
 *
 * @param {string} content
 * @returns {Promise<string>}
 */
async function bcryptHashContent(content) {
  console.info("Hashing ballot content...");
  const saltRound = 10;

  return await new Promise((resolve, reject) => {
    bcrypt.hash(content, saltRound, (err, encrypted) => {
      if (err) {
        console.error("Error hashing password.");
        return reject(err);
      }
      return resolve(encrypted);
    });
  });
}

module.exports = { bcryptHashContent };
