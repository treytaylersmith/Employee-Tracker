DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

\c employees_db;

CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  department_name VARCHAR(100) NOT NULL
);

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    FOREIGN KEY (department_id) 
    REFERENCES department(id) NOT NULL
);

CREATE TABLE employee(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    FOREIGN KEY (role_id)
    REFERENCES role(id)
    manager_id INTEGER 
);