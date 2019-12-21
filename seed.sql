USE employee_managementDB;

INSERT INTO department (name) VALUES("Sales");
INSERT INTO department (name) VALUES("Engineering");
INSERT INTO department (name) VALUES("Legal");
INSERT INTO department (name) VALUES("Finance");

INSERT INTO role (title,salary,department_id) 
VALUES("Sales Lead",50000,1);
INSERT INTO role (title,salary,department_id) 
VALUES("Sales Person",30000,1);
INSERT INTO role (title,salary,department_id) 
VALUES("Lead Engineer",150000,2);
INSERT INTO role (title,salary,department_id) 
VALUES("Software Engineer",75000,2);
INSERT INTO role (title,salary,department_id) 
VALUES("Lawyer",200000,3);
INSERT INTO role (title,salary,department_id) 
VALUES("Legal Team Lead",250000,3);
INSERT INTO role (title,salary,department_id) 
VALUES("Accountant",50000,4);

INSERT INTO employee (first_name,last_name,role_id,manager_id) 
VALUES("Tom","Clancy",1,null);
INSERT INTO employee (first_name,last_name,role_id,manager_id) 
VALUES("Dan","Brown",2,1);
INSERT INTO employee (first_name,last_name,role_id,manager_id) 
VALUES("William","Shakespeare",3,null);
INSERT INTO employee (first_name,last_name,role_id,manager_id) 
VALUES("Emily","Dickinson",4,3);
INSERT INTO employee (first_name,last_name,role_id,manager_id) 
VALUES("Arthur Conan","Doyle",6,null);
INSERT INTO employee (first_name,last_name,role_id,manager_id) 
VALUES("Leo","Tolstoy",5,5);
INSERT INTO employee (first_name,last_name,role_id,manager_id) 
VALUES("Edgar Allen","Poe",7,null);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
