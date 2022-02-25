import { ISession } from './session.interface';
export class Session implements ISession {
    dt_to: Date;
    car_id: number;
    tariff_id: number;
    discount_id: number;
    id: number;
    dt_from: Date;
}
