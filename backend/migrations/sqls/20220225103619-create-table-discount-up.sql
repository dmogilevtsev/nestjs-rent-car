/* Replace with your SQL commands */
CREATE TABLE
    discount (
        id SERIAL PRIMARY KEY,
        day_from INTEGER NOT NULL,
        day_to INTEGER NOT NULL,
        percent FLOAT NOT NULL
    );