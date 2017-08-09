DROP DATABASE IF EXISTS clustr;
CREATE DATABASE clustr;

\c clustr;

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	first_name VARCHAR,
	last_name VARCHAR
);

INSERT INTO users (first_name, last_name)
	VALUES ('Adelle', 'Dimitui');