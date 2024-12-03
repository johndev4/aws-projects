const GET_EMPLOYEE_ID_BY_EMAIL = `
SELECT id
FROM public.employee
WHERE email = $1
LIMIT 1;
`;

module.exports = { CREATE_EMPLOYEE_TABLE, INSERT_EMPLOYEE, GET_EMPLOYEE_ID_BY_EMAIL };
