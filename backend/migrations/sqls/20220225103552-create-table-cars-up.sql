/* Replace with your SQL commands */
CREATE TABLE
    IF NOT EXISTS cars (
        id SERIAL PRIMARY KEY,
        brand VARCHAR (60) NOT NULL,
        model VARCHAR (60) NOT NULL,
        gos VARCHAR (10) NOT NULL,
        VIN VARCHAR (17) NOT NULL
    );