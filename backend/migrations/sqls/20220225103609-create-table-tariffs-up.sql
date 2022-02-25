/* Replace with your SQL commands */
CREATE TABLE
    tariffs (
        id SERIAL PRIMARY KEY,
        price FLOAT NOT NULL,
        kmPerDay INTEGER NOT NULL
    );