-- db/seeds.sql

-- Departments
INSERT INTO department (name) VALUES
('Sales'),
('Marketing'),
('Engineering'),
('Human Resources'),
('Finance'),
('IT'),
('Legal'),
('Operations');

-- Roles
INSERT INTO role (title, salary, department_id) VALUES
('Sales Manager', 80000, 1),
('Sales Representative', 50000, 1),
('Marketing Specialist', 60000, 2),
('Marketing Manager', 75000, 2),
('Lead Software Engineer', 120000, 3),
('Software Engineer', 90000, 3),
('HR Coordinator', 45000, 4),
('HR Manager', 65000, 4),
('Accountant', 65000, 5),
('Financial Analyst', 75000, 5),
('IT Support Technician', 50000, 6),
('IT Manager', 90000, 6),
('Paralegal', 55000, 7),
('Lawyer', 100000, 7),
('Operations Manager', 80000, 8),
('Operations Coordinator', 50000, 8);

-- Employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Michael', 'Johnson', 2, 1),
('Emily', 'Davis', 3, 4),
('David', 'Williams', 4, NULL),
('Jessica', 'Wilson', 5, NULL),
('Andrew', 'Thompson', 6, 7),
('Samantha', 'Lee', 6, 7),
('Linda', 'Brown', 7, 8),
('William', 'Taylor', 8, NULL),
('Olivia', 'Anderson', 9, NULL),
('Daniel', 'Martinez', 10, 11),
('Sophia', 'Hernandez', 11, 12),
('Benjamin', 'Sanchez', 12, NULL),
('Isabella', 'Flores', 13, 14),
('Alexander', 'Diaz', 14, NULL),
('Ava', 'Ramirez', 15, NULL),
('Jacob', 'Gutierrez', 16, 17),
('Emma', 'Morales', 16, 17),
('Mason', 'Serrano',16,  NULL);