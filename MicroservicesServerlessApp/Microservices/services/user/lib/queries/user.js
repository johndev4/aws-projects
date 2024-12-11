const INSERT_USER_INFO = `
INSERT INTO mycloudorg.users_info (username, first_name, last_name, email, phone_number, date_of_birth, street, barangay, city, municipality, country)
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
RETURNING id;
`;

const GET_USER_INFO_BY_USERNAME = `
SELECT
  username,
  first_name,
  last_name,
  email,
  phone_number,
  date_of_birth,
  street,
  barangay,
  city,
  municipality,
  country
FROM mycloudorg.users_info
WHERE username = $1
LIMIT 1;
`;

module.exports = { INSERT_USER_INFO, GET_USER_INFO_BY_USERNAME };
