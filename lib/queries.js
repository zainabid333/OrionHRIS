// lib/queries.js

const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'employee_tracker',
    password: 'legion',
    port: 5432,
});

const queries = {
    viewAllDepartments: async () => {
        const result = await pool.query('SELECT * FROM department');
        return result.rows;
    },

    viewAllRoles: async () => {
        const result = await pool.query(`
            SELECT role.id, role.title, department.name AS department, role.salary 
            FROM role 
            JOIN department ON role.department_id = department.id
        `);
        return result.rows;
    },

    viewAllEmployees: async () => {
        const result = await pool.query(`
            SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, 
                   CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            LEFT JOIN role ON e.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            LEFT JOIN employee m ON e.manager_id = m.id
        `);
        return result.rows;
    },

    addDepartment: async (name) => {
        await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
    },

    addRole: async (title, salary, departmentId) => {
        await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, departmentId]);
    },

    addEmployee: async (firstName, lastName, roleId, managerId) => {
        await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [firstName, lastName, roleId, managerId]);
    },

    updateEmployeeRole: async (employeeId, roleId) => {
        await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleId, employeeId]);
    },

    getDepartments: async () => {
        const result = await pool.query('SELECT id, name FROM department');
        return result.rows;
    },

    getRoles: async () => {
        const result = await pool.query('SELECT id, title FROM role');
        return result.rows;
    },

    getEmployees: async () => {
        const result = await pool.query('SELECT id, CONCAT(first_name, \' \', last_name) AS name FROM employee');
        return result.rows;
    },

    searchEmployees: async (searchTerm) => {
        const result = await pool.query(`
            SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, 
                   CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            LEFT JOIN role ON e.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            LEFT JOIN employee m ON e.manager_id = m.id
            WHERE e.first_name ILIKE $1 OR e.last_name ILIKE $1
        `, [`%${searchTerm}%`]);
        return result.rows;
    },
};

module.exports = queries;