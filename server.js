const { Pool } = require("pg");
require("dotenv").config();
const inquirer = require("inquirer");

let pool;
// Connect to database
if (process.env.DB_URL) {
  pool = new Pool(process.env.DB_URL);
} else {
  pool = new Pool(
    {
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      host: "localhost",
      database: "employee_db",
    },
    console.log(`Connected to the employee_db database.`)
  );
}
pool.connect();

// Create an employee
async function createEmployee() {
  const roleData = await getRoles();
  let roles = [];
  for (const role of roleData) {
    roles.push(role.title);
  }

  const managerData = await getEmployees();
  let managers = [];
  for (const manager of managerData) {
    managers.push(`${manager.first_name} ${manager.last_name}`);
  }

  managers.push("Employee has no manager");
  const prompt = [
    {
      type: "input",
      name: "first_name",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the employee's last name?",
    },
    {
      type: "list",
      name: "role",
      message: "What is their role?",
      choices: roles,
    },
    {
      type: "list",
      name: "manager",
      message: "Who is their manager?",
      choices: managers,
    },
  ];
  const answer = await inquirer.prompt(prompt);
  const roleId = roles.indexOf(answer.role) + 1;

  let managerId;
  if (answer.manager === "Employee has no manager") {
    managerId = null;
  } else {
    const managerIndex = managers.indexOf(answer.manager);
    managerId = managerData[managerIndex].id;
  }

  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ($1, $2, $3, $4)`;
  const params = [answer.first_name, answer.last_name, roleId, managerId];

  await pool.query(sql, params, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(
      `Added ${answer.first_name} ${answer.last_name} to the database`
    );
  });
}

// Read all employees
async function getEmployees(log) {
  const sql = `SELECT * FROM employee`;

  try {
    const res = await pool.query(sql);
    const employees = res.rows.sort((a, b) => a.id - b.id);
    
    log ? console.table(employees) : null;
    return employees;
  } catch (err) {
    console.error("Error executing query", err.stack);
  }
}

// Delete an employee
async function deleteEmployee() {
  const employeeData = await getEmployees();
  let employees = [];
  for (employee of employeeData) {
    employees.push(`${employee.first_name} ${employee.last_name}`);
  }

  const prompt = [
    {
      type: "list",
      name: "employee",
      message: "What is the employee's id?",
      choices: employees,
    },
  ];
  const answer = await inquirer.prompt(prompt);
  const sql = `DELETE FROM employee WHERE id = $1`;
  const employeeId = employeeData[employees.indexOf(answer.employee)].id;
  const params = [employeeId];

  await pool.query(sql, params, (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
      return;
    }
    console.log(`${answer.employee} removed from Database`);
    
  });
}

async function createRole() {
  const departmentData = await getDepartments();
  let departments = [];

  for (const d of departmentData) {
    departments.push(d.department_name);
  }
  const questions = [
    {
      type: "input",
      name: "title",
      message: "What is the position's title?",
    },
    {
      type: "number",
      name: "salary",
      message: "What is the position's salary?",
    },
    {
      type: "list",
      name: "department",
      message: "Which department will it be located in?",
      choices: departments,
    },
  ];

  const answers = await inquirer.prompt(questions);

  const sql = `INSERT INTO role (title, salary, department_id)
    VALUES ($1, $2, $3)`;
  const departIndex = departments.indexOf(answers.department);
  const departId = departmentData[departIndex].id;

  const params = [answers.title, answers.salary, departId];

  await pool.query(sql, params);
  console.log(`${params[0]} added to Database`);
  return;
}

async function getRoles(log) {
  const sql = `SELECT * FROM role`;
  const res = await pool.query(sql);
  log ? console.table(res.rows) : null;
  return res.rows;
}

async function updateEmployee() {
  const employeeData = await getEmployees();
  let employees = [];
  for (employee of employeeData) {
    employees.push(`${employee.first_name} ${employee.last_name}`);
  }

  const roleData = await getRoles();
  let roles = [];
  for (role of roleData) {
    roles.push(role.title);
  }

  const questions = [
    {
      type: "list",
      name: "employee",
      message: "Which Employee would you like to update?",
      choices: employees,
    },
    {
      type: "list",
      name: "role",
      message: "Which role would you like to update them to?",
      choices: roles,
    },
  ];

  const answers = await inquirer.prompt(questions);
  const roleId = roleData[roles.indexOf(answers.role)].id;
  const employeeId = employeeData[employees.indexOf(answers.employee)].id;

  const sql = `UPDATE employee SET role_id = $1 WHERE id = $2`;
  const params = [roleId, employeeId];

  const res = await pool.query(sql, params, (err)=> {
    if (err) {

      console.error("Error executing query", err.stack);
      return;
    }
    console.log(`Updated ${answers.employee}'s role to ${answers.role}`);
  });

  
}
async function getDepartments(log) {
  const sql = `SELECT * FROM department`;

  try {
    const res = await pool.query(sql);
    log ? console.table(res.rows) : null;
    return res.rows;
  } catch (err) {
    console.error("Error executing query", err.stack);
  }
}

async function createDepartment() {
  const questions = [
    {
      type: "input",
      name: "name",
      message: "What is the department's name?",
    },
  ];

  const answers = await inquirer.prompt(questions);

  const sql = `INSERT INTO department (department_name)
  VALUES ($1)`;

  const params = [answers.name];
  await pool.query(sql, params, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }

    return result.rows;
  });
}

async function checkLoop() {
  const againQuestion = [
    {
      type: "list",
      name: "confirm",
      message: "Would you like to do anything else?",
      choices: ["Yes", "No"],
    },
  ];

  const again = await inquirer.prompt(againQuestion);

  if (again.confirm === "Yes") {
    run();
  }
  return;
}

const operationPrompt = [
  {
    type: "list",
    name: "operation",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "Add Employee",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Remove Employee",
      "Update Employee Role",
    ],
  },
];

async function run() {
  const prompt = await inquirer.prompt(operationPrompt);
  const answer = prompt.operation;

  switch (answer) {
    case "View All Employees":
      await getEmployees(true);

      break;
    case "Add Employee":
      await createEmployee();

      break;
    case "View All Roles":
      await getRoles(true);

      break;
    case "Add Role":
      await createRole();

      break;
    case "View All Departments":
      await getDepartments(true);

      break;
    case "Add Department":
      await createDepartment();

      break;
    case "Remove Employee":
      await deleteEmployee();

      break;
    case "Update Employee Role":
      await updateEmployee();
    
      break;
  }
   checkLoop();
}

run();
