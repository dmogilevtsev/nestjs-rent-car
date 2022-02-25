/* Replace with your SQL commands */
CREATE TABLE
    discount (
        id SERIAL PRIMARY KEY,
        day_from INTEGER NOT NULL,
        day_to INTEGER NOT NULL,
        percent FLOAT NOT NULL
    );

INSERT INTO
    discount (day_from, day_to, percent)
VALUES (3, 5, 5), (6, 14, 10), (15, 30, 15)