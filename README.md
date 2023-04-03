clone this project

Create a mysql db and add this table
`CREATE TABLE User (
  id INT(11) NOT NULL AUTO_INCREMENT,
  user VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(150) NOT NULL,
  email VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);`

create .env file based on .env.template file
## Available Scripts

In the project directory, you can run:

### `npm run dev`