/* Replace with your SQL commands */
CREATE TABLE
    tariffs (
        id SERIAL PRIMARY KEY,
        price FLOAT NOT NULL,
        kmPerDay INTEGER NOT NULL
    );

INSERT INTO
    tariffs (price, kmPerDay)
VALUES (270, 200), (330, 350), (390, 500);