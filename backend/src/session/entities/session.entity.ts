import { ISession } from './session.interface';
export class Session implements ISession {
    id: number;
    dt_to: Date;
    car_id: number;
    tariff_id: number;
    discount_id: number;
    dt_from: Date;
    cost: number;
}
