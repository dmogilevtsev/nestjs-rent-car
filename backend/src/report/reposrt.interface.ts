export interface IAverageCarLoadByDayResponse {
    dt_from: Date;
    dt_to: Date;
    car: string;
}

export interface ICarWithDates {
    [k: string]: {
        dt_from: Date;
        dt_to: Date;
        car: string;
    }[];
}
