const inquirer = require("inquirer");

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
            "Add Department"]
    }
]

const run = async ()  =>{

    const prompt = await  inquirer.prompt(operationPrompt);
    const answer = prompt.operation;
    
    switch(answer){
        case "View All Employees":
            const response = await fetch('/api/employee', {
                method: 'GET',
            });
            console.log(response);
            break;
        case "Add Employee":

            break;
        case "View All Roles":

            break;
        case  "Add Role":

            break;
        case "View All Departments":

            break;
        case "Add Department":
            
            break;
    }
}

run();