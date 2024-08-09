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
    //View department query
    viewAllDepartments: async () => {
        const result = await pool.query('SELECT * FROM department');
        return result.rows;
    },

    //view roles query
    viewAllRoles: async () => {
        const result = await pool.query(`
            SELECT role.id, role.title, department.name AS department, role.salary 
            FROM role 
            JOIN department ON role.department_id = department.id
        `);
        return result.rows;
    },

    //view all employees query
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

    //Adding Department
    addDepartment: async (name) => {
        await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
    },

    //Adding role
    addRole: async (title, salary, departmentId) => {
        await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, departmentId]);
    },

    //Adding employee
    addEmployee: async (firstName, lastName, roleId, managerId) => {
        await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [firstName, lastName, roleId, managerId]);
    },

    //Update an employee's role
    updateEmployeeRole: async (employeeId, roleId) => {
        await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleId, employeeId]);
    },

    //Get departments
    getDepartments: async () => {
        const result = await pool.query('SELECT id, name FROM department');
        return result.rows;
    },

    //View all roles
    getRoles: async () => {
        const result = await pool.query('SELECT id, title FROM role');
        return result.rows;
    },

    //view all employees
    getEmployees: async () => {
        const result = await pool.query('SELECT id, CONCAT(first_name, \' \', last_name) AS name FROM employee');
        return result.rows;
    },

    //View employees by manager
    viewEmployeesByManager: async (managerId) => {
        let query;
        let params;
        if (managerId === null) {
            query = `
                SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary
                FROM employee e
                LEFT JOIN role ON e.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                WHERE e.manager_id IS NULL
            `;
            params = [];
        } else {
            query = `
                SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary
                FROM employee e
                LEFT JOIN role ON e.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                WHERE e.manager_id = $1`;
            params = [managerId];
        }
        const result = await pool.query(query, params);
        return result.rows;
    },

    // View employees by department
    getEmployeesByDepartment: async (departmentId) => {
        const result = await pool.query(`
            SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary
            FROM employee e
            LEFT JOIN role ON e.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            WHERE department.id = $1
        `, [departmentId]);
        return result.rows;
    },

    //Search employees
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

    // Update employee's Manager
    updateEmployeeManger: async (employeeId, managerId) => {
        await pool.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [managerId, employeeId]);
    },

    // Delete a department and all roles associated with it and unassigning department and roles from employess
    deleteDepartment: async (departmentId) => {
        try {
            await pool.query('BEGIN');
            // Get all roles associated with the department
            const roleResult = await pool.query('SELECT id FROM role WHERE department_id = $1', [departmentId]);
            const roleIds = roleResult.rows.map(role => role.id).join(',');

            // Delete all employees associated with the roles in the department
            await pool.query(`DELETE FROM employee WHERE role_id IN (${roleIds})`);

            // Delete all roles associated with the department
            await pool.query('DELETE FROM role WHERE department_id = $1', [departmentId]);

            // Delete the department
            await pool.query('DELETE FROM department WHERE id = $1', [departmentId]);

            await pool.query('COMMIT');
        } catch (err) {
            await pool.query('ROLLBACK');
            throw err;
        }
    },

    //Delete a Role and associated employees
    deleteRole: async (roleId) => {
        try {
            await pool.query('BEGIN');

            await pool.query('DELETE FROM employee WHERE role_id=$1', [roleId]);

            await pool.query('DELETE FROM role WHERE id=$1', [roleId]);

            await pool.query('COMMIT');
        } catch (error) {
            await pool.query('ROLLBACK');
            throw error;
        }
    },

    //Deleting employees
    deleteEmployee: async (employeeId) => {
        try {
            await pool.query('BEGIN');

            await pool.query('UPDATE employee SET manager_id = NULL WHERE manager_id=$1', [employeeId]);

            await pool.query('DELETE FROM employee WHERE id=$1', [employeeId]);

            await pool.query('COMMIT');
        } catch (error) {
            await pool.query('ROLLBACK');
            throw error;
        }
    },

    //View budgets by department
    viewBudgetByDepartment: async () => {
        const result = await pool.query(`
            SELECT department.name AS department, SUM(role.salary) AS budget
            FROM employee
            JOIN role ON employee.role_id = role.id
            JOIN department ON role.department_id = department.id
            GROUP BY department.name
        `);
        return result.rows;
    }

};

module.exports = queries;