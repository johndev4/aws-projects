const CREATE_EMPLOYEE_TABLE = `
-- Drop table if it exists
DROP TABLE IF EXISTS public.employee;

-- Create EMPLOYEE table
CREATE TABLE public.employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hire_date DATE,
    job_title VARCHAR(100),
    department VARCHAR(50),
    salary DECIMAL(10,2),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index on email for faster lookups
CREATE INDEX idx_employee_email ON public.employee(email);

-- Add comments to the table
COMMENT ON TABLE public.employee IS 'Stores employee information';
`;

const INSERT_EMPLOYEE = `
INSERT INTO public.employee
(id, first_name, last_name, email, hire_date, job_title, department, salary, active, created_at, updated_at)
VALUES(nextval('employee_id_seq'::regclass), 'Juan', 'Dela Cruz', 'juandelacruz@myorgcloud.com', 'Software Engineer', 'IT', '100000', 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
`;

const GET_EMPLOYEE_BY_ID = `
SELECT 
    id,
    first_name,
    last_name,
    email,
    job_title,
    department
FROM public.employee
WHERE id = $1
LIMIT 1;
`;

module.exports = { CREATE_EMPLOYEE_TABLE, INSERT_EMPLOYEE, GET_EMPLOYEE_BY_ID };
