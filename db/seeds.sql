INSERT INTO department (department_name)
VALUES ('IT'),
       ('Sales'),
       ('Human Resources'),
       ('Marketing'),
       ('Janitorial');

INSERT INTO role (department_id , title, salary)
VALUES (1, 'Front end developer', 60000),
       (2, 'Sales Manager', 120000),
       (1, 'Technician Specialist', 140000),
       (3, 'Employee Relations', 69000),
       (5, 'Waste Management', 55000),
       (4, 'Graphic Designer', 72000),
       (4, 'Social Media Manager', 68000);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Greg', 'Smith', 1,),
       ('Jamie', 'Huffman', 4, 1),
       ('Randi', 'Ziegle', 3),
       ('Jesse', 'McDonald', 2),
       ('Chris', 'Lee', 7, 1),
       ('Dan', 'Johnson', 5),
       ('Sasha', 'Sims', 3, 3);