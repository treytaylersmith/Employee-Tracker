INSERT INTO department (department_name)
VALUES ('IT'),
       ('Sales'),
       ('Human Resources'),
       ('Marketing'),
       ('Janitorial');

INSERT INTO role ( title, salary, department_id )
VALUES ( 'Front end developer', 60000, 1),
       ( 'Sales Manager', 120000,2 ),
       ('Technician Specialist', 140000,1 ),
       ( 'Employee Relations', 69000,3),
       ( 'Waste Management', 55000, 5),
       ( 'Graphic Designer', 72000, 4),
       ( 'Social Media Manager', 68000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Greg', 'Smith', 1, null),
       ('Jamie', 'Huffman', 4, 1),
       ('Randi', 'Ziegle', 3, null),
       ('Jesse', 'McDonald', 2, null),
       ('Chris', 'Lee', 7, 1),
       ('Dan', 'Johnson', 5, null),
       ('Sasha', 'Sims', 3, 3);