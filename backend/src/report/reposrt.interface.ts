export interface IReportData {
    headers: IReportHeaders[];
    datas: IReportDatas[];
    options: IReportOptions;
}

interface IReportHeaders {
    label: string;
    property: string;
    width: number;
}

interface IReportDatas {
    [k: string]: string;
}

interface IReportOptions {
    width: number;
}

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
