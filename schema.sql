DROP DATABASE IF EXISTS employee_managementDB;
CREATE DATABASE employee_managementDB;
USE employee_managementDB;

CREATE TABLE department(
id INT AUTO_INCREMENT NOT NULL,
name VARCHAR(30) NOT NULL,
PRIMARY KEY (id)
);

CREATE TABLE role(
 id INT AUTO_INCREMENT NOT NULL,
 title VARCHAR(30) NOT NULL,
 salary DECIMAL(10,2) NOT NULL,
 department_id INT  NULL,
 CONSTRAINT fk_category2
    FOREIGN KEY (department_id) 
    REFERENCES department(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
 PRIMARY KEY (id)
); 


CREATE TABLE employee(
  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NULL,
  manager_id INT NULL,
  CONSTRAINT fk_category1
    FOREIGN KEY (role_id) 
    REFERENCES role(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
	FOREIGN KEY (manager_id) 
    REFERENCES employee(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
  PRIMARY KEY (id)
);


