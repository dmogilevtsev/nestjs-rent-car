export interface ISession {
    id: number;
    dt_from: Date;
    dt_to: Date;
    car_id: number;
    tariff_id: number;
    discount_id: number;
    cost: number;
}
