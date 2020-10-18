USE employee_db;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('John', 'Doe', 1, null),
  ('Tom', 'Sawyer', 2, 1),
  ('Huck', 'Finn', 3, 2),
  ('Jane', 'Austen', 4, null),
  ('Elizabeth', 'Bennett', 5, 4),
  ('Anne', 'Shirley', 6, 4);
  
INSERT INTO department (name)
VALUES
  ('Sales'),
  ('Product');

INSERT INTO roles (title, salary, department_id)
VALUES
  ('VP Sales', 100000, 1),
  ('Sales Director', 70000, 1),
  ('sales rep', 40000, 1),
  ('VP Product', 150000, 2),
  ('Scrum Master', 90000, 2),
  ('Sr Developer', 120000, 2),
  ('Intern', 30000, 2);
