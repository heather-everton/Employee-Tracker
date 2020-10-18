const mysql = require('mysql2');
const inquirer = require("inquirer");

// Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  // Your MySQL username
  user: 'root',
  // Your MySQL password
  password: '@ce2010T',
  database: 'employee_db'
});

connection.connect(err => {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
  afterConnection();
});

afterConnection = () => {
  firstPrompt()
};

// function which prompts the user for what action they should take
function firstPrompt() {

  inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "Would you like to do?",
      choices: [
          "View all departments", 
          "View all roles", 
          "View all employees", 
          "Add a department", 
          "Add a role", 
          "Add an employee", 
          "Update an employee's role",
          "Quit"]
    })
    .then(function ({ task }) {
      switch (task) {
        case "View all departments":
            viewDepartments();
            break;
        case "View all roles":
            viewRoles();
            break;
        case "View all employees":
          viewEmployee();
          break;
        case "Add a department":
            addDepartment();
            break;
        case "Add a role":
            lookupDepartment();
            break;
        case "Add an employee":
          lookupRole();
          break;
        case "Update an employee's role":
          lookupEmployee();
          break;
        case "Quit":
          connection.end();
          break;
      }
    });
}

//"View databases"/ READ all, SELECT * FROM
function viewDepartments() {
    console.log("Viewing departments\n");
  
    var query = `SELECT * FROM department`
  
    connection.query(query, function (err, res) {
      if (err) throw err;
  
      console.table(res);
      console.log("Departments viewed!\n");
  
      firstPrompt();
    });
}

function viewRoles() {
    console.log("Viewing roles\n");
  
    var query = `SELECT role.id, role.title, role.salary, department.name AS Department FROM role INNER JOIN department ON role.department_id = department.id;`
  
    connection.query(query, function (err, res) {
      if (err) throw err;
  
      console.table(res);
      console.log("Roles viewed!\n");
  
      firstPrompt();
    });
}

function viewEmployee() {
    console.log("Viewing employees\n");

    var query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS Department, concat(manager.first_name, " ", manager.last_name) AS Manager
    FROM employee 
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id;`

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log("Employees viewed!\n");

        firstPrompt();
    });
}


// Add to databases/ CREATE: INSERT INTO
function addDepartment() {
    console.log("Adding a department!")
    inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the department name?"
      },
    
    ])
    .then(function (answer) {
      console.log(answer);

      var query = `INSERT INTO department SET ?`
      // when finished prompting, insert a new item into the db with that info
      connection.query(query,
        {
          name: answer.name,
        },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.insertedRows + "Inserted successfully!\n");

          firstPrompt();
        });
    });
}

function lookupDepartment() {
  console.log("lookup up departments!")

  var query =`SELECT * FROM department`

  connection.query(query, function (err, res) {
    console.log(query)
    if (err) throw err;

    const departmentChoices = res.map(({ id, name }) => ({
      value: id, name: `${name}`
    }));

    console.table(res);
    console.log("Department To Insert!");

    addRole(departmentChoices);
  });
}

function addRole(departmentChoices) {
    console.log("Adding a role!")

    inquirer
      .prompt([
        {
          type: "list",
          name: "department",
          message: "Which department is the role in?",
          choices: departmentChoices
        },
        {
          type: "input",
          name: "title",
          message: "What is the job title?"
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary?"
        },
      ])
      .then(function (answer) {
        console.log(answer);
  
        var query = `INSERT INTO role SET ?`
        // when finished prompting, insert a new item into the db with that info
        connection.query(query,
          {
            department_id: answer.department,
            title: answer.title,
            salary: answer.salary,
          },
          function (err, res) {
            if (err) throw err;
  
            console.table(res);
            console.log(res.insertedRows + "Inserted successfully!\n");
  
            firstPrompt();
          });
      });
}
  
function lookupRole() {
  console.log("lookup up roles!")

  var query =`SELECT title AS name, id FROM role`

  connection.query(query, function (err, res) {
    console.log(res)
    if (err) throw err;

    const roleChoices = res.map(({name, id}) => ({
      name: name,
      value: id
    }));

    // console.table(res);
    console.log("lookupRole", roleChoices);

    lookupManager(roleChoices);
  });
}

function lookupManager(roleChoices) {
  console.log("lookupManager", roleChoices)

  var query =`SELECT * FROM employee`

  connection.query(query, function (err, res) {
    console.log("create role choices")
    if (err) throw err;

    let managerChoices = res.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }));
    const none = {
      name: "None",
      value: null
    }
    managerChoices.push(none)

    console.table(res);
    console.log("ManagerToInsert!");

    addEmployee(roleChoices, managerChoices);
  });
}

function addEmployee(roleChoices, managerChoices) {
  console.log("addEmployee", roleChoices)

  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?"
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?"
      },
      {
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: roleChoices
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the employee's Manager?",
        choices: managerChoices
      },
    ])
    .then(function (answer) {
      console.log(answer);

      var query = `INSERT INTO employee SET ?`
      // when finished prompting, insert a new item into the db with that info
      connection.query(query,
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.roleId,
          manager_id: answer.manager,
        },
        function (err, res) {
          if (err) throw err;

          console.table(res);

          firstPrompt();
        });
    });
}

function lookupEmployee() {
  var query =`SELECT * FROM employee`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const employeeChoices = res.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }));

    lookupNewRole(employeeChoices);
  });
}
function lookupNewRole(employeeChoices) {
  console.log("lookup up roles!")

  var query =`SELECT title AS name, id FROM role`

  connection.query(query, function (err, res) {
    console.log(res)
    if (err) throw err;

    const newRoleChoices = res.map(({name, id}) => ({
      name: name,
      value: id
    }));

    console.table(res);
    updateEmployeeRole(employeeChoices, newRoleChoices);
  });
}

function updateEmployeeRole(employeeChoices, newRoleChoices) { 
  inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: "Which employee do you want to update?",
        choices: employeeChoices
      },
      {
        type: "list",
        name: "roleId",
        message: "What is the employee's new role?",
        choices: newRoleChoices
      },
      
    ])
    .then(function (answer) {
      const query = connection.query(
        'UPDATE employee SET ? WHERE ?',
        [
          {
            role_id: answer.roleId
          },
          {
            id: answer.employee
          }
        ],
        function(err, res) {
          if (err) throw err;
        }
      );
      firstPrompt();
    });
}