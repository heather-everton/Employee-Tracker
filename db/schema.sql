DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE employee (
  id INTEGER(11) auto_increment NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,  
  role_id INTEGER NOT NULL REFERENCES role(id),
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL
  manager_id INTEGER REFERENCES employee(id),
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INTEGER(11) auto_increment NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary decimal NOT NULL,
  department_id INTEGER NOT NULL REFERENCES department(id),
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
  PRIMARY KEY (id)
);

CREATE TABLE department (
  id INTEGER(11) auto_increment NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);