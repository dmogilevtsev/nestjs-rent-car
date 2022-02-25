/* Replace with your SQL commands */
CREATE TABLE
    session (
        id SERIAL NOT NULL,
        dt_from TIMESTAMP
        WITH
            TIME ZONE NOT NULL,
            dt_to TIMESTAMP
        WITH
            TIME ZONE NOT NULL,
            car_id INTEGER NOT NULL,
            tariff_id INTEGER NOT NULL,
            discount_id INTEGER
    );