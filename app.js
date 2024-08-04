// app.js

const inquirer = require('inquirer');
const queries = require('./lib/queries');

async function mainMenu() {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Search an employee',
                'Exit'
            ]
        }
    ]);

    switch (action) {
        case 'View all departments':
            const departments = await queries.viewAllDepartments();
            console.table(departments);
            break;
        case 'View all roles':
            const roles = await queries.viewAllRoles();
            console.table(roles);
            break;
        case 'View all employees':
            const employees = await queries.viewAllEmployees();
            console.table(employees);
            break;
        case 'Add a department':
            await addDepartment();
            break;
        case 'Add a role':
            await addRole();
            break;
        case 'Add an employee':
            await addEmployee();
            break;
        case 'Update an employee role':
            await updateEmployeeRole();
            break;
        case 'Search an employee':
            await searchEmployee();
            break;
        case 'Exit':
            console.log('Goodbye!');
            process.exit();
    }

    await mainMenu();
}
//adding department
async function addDepartment() {
    const { name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the department?'
        }
    ]);

    await queries.addDepartment(name);
    console.log(`Added ${name} to departments`);
}

//adding role
async function addRole() {
    const departments = await queries.getDepartments();
    const { title, salary, departmentId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this role?'
        },
        {
            type: 'list',
            name: 'departmentId',
            message: 'Which department does this role belong to?',
            choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
        }
    ]);

    await queries.addRole(title, salary, departmentId);
    console.log(`Added ${title} to roles`);
}

//adding employee
async function addEmployee() {
    const roles = await queries.getRoles();
    const employees = await queries.getEmployees();
    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?"
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?"
        },
        {
            type: 'list',
            name: 'roleId',
            message: "What is the employee's role?",
            choices: roles.map(role => ({ name: role.title, value: role.id }))
        },
        {
            type: 'list',
            name: 'managerId',
            message: "Who is the employee's manager?",
            choices: [{ name: 'None', value: null }, ...employees.map(emp => ({ name: emp.name, value: emp.id }))]
        }
    ]);

    await queries.addEmployee(firstName, lastName, roleId, managerId);
    console.log(`Added ${firstName} ${lastName} to employees`);
}

//updating employee role
async function updateEmployeeRole() {
    const employees = await queries.getEmployees();
    const roles = await queries.getRoles();
    const { employeeId, roleId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Which employee\'s role do you want to update?',
            choices: employees.map(emp => ({ name: emp.name, value: emp.id }))
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Which role do you want to assign to the selected employee?',
            choices: roles.map(role => ({ name: role.title, value: role.id }))
        }
    ]);

    await queries.updateEmployeeRole(employeeId, roleId);
    console.log(`Updated employee's role`);
}

async function searchEmployee() {
    const { searchTerm } = await inquirer.prompt([
        {
            type: 'input',
            name: 'searchTerm',
            message: 'Enter the name of the employee to search:'
        }
    ]);

    const employees = await queries.searchEmployees(searchTerm);
    if (employees.length === 0) {
        console.log(`No employees found with the name "${searchTerm}"`);
    } else {
        console.table(employees);
    }
}



mainMenu();