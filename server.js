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
  const roleData = await getEmployeeRoles();
  let roles = [];
  for(role of roleData){
    roles.push(roleData.title);
  }

  const managerData = await readEmployees();
  let managers = []
  for(manager of managerData){
    managers.push(`${managerData.first_name} ${managerData.last_name}`);
  }
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
      choices: managers
    }
  ];
  const answer = await inquirer.prompt(prompt);
  const roleId = roles.indexOf(answer.role) +1;
  const managerIndex = managers.indexOf(answer.manager);
  const managerId = managerData[managerIndex].id;

  const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES ($1, $2. $3, $4)`;
  const params = [answer.first_name, answer.last_name, roleId, managerId];

  pool.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    console.table(result.rows);
  });
}

// Read all employees
function readEmployees() {
  const sql = `SELECT * FROM employee`;

  pool.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query", err.stack);
    } else {
      console.log(result.rows);
      const idLength = 2;
      let firstNameLength = 10;
      let lastNameLength = 9;
      let titleLength = 5;
      let departmentLength = 10;
      let salaryLength = 6;
      let managerLength = 7;

      for (row of result.rows) {
        if (row.first_name.length > firstNameLength) {
          firstNameLength = row.first_name.length;
        }
        if (row.last_name.length > lastNameLength) {
          lastNameLength = row.last_name.length;
        }
        if (row.title.length > titleLength) {
          titleLength = row.title.length;
        }
        const salaryString = row.salary + "";
        if (salaryString.length > salaryLength) {
          salaryLength = salaryString.length;
        }
      }

      return result.rows;
    }
  });
}

// Delete an employee
async function deleteEmployee() {
  const prompt = [
    {
      type: "input",
      name: "employeeId",
      message: "What is the employee's id?",
    },
  ];
  const answer = await inquirer.prompt(prompt);
  const sql = `DELETE FROM employee WHERE id = $1`;
  const params = [answer.employeeId];

  pool.query(sql, params, (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
      return;
    }
    console.table(res.rows);
  });
}

function getEmployeeRoles() {
  const sql = `SELECT id, title, salary FROM role`;
  pool.query(sql, (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
      return;
    }
    console.table(res.rows);
    return res.rows;
  });
}

function createRole({ body }, res) {
  const sql = `INSERT INTO role (title, salary, department_id)
    VALUES ($1, $2, )`;
  const params = [body.first_name, body.last_name];

  pool.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    console.table(result.rows);
    return result.rows;
  });
}

function getDepartmentRoles() {
  const sql = `SELECT department.department_name AS department, role.title FROM role LEFT JOIN department ON role.department_id = department.id ORDER BY department_name;`;
  pool.query(sql, (err, result) => {
    if (err) {
      console.log(err)
      return;
    }
    console.table(result.rows);
  });
}

async function createDepartment() {}

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
    ],
  },
];

const run = async () => {
  const prompt = await inquirer.prompt(operationPrompt);
  const answer = prompt.operation;

  switch (answer) {
    case "View All Employees":
      readEmployees();
      break;
    case "Add Employee":
      createEmployee();
      break;
    case "View All Roles":
      getEmployeeRoles();
      break;
    case "Add Role":
      createRole();
      break;
    case "View All Departments":
      getDepartmentRoles();
      break;
    case "Add Department":
      createDepartment();
      break;
    case "Remove Employee":
      deleteEmployee();
      break;
  }

  return;
};

run();
