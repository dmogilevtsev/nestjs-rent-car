import { IDiscount } from './discount.interface';
export class Discount implements IDiscount {
    id: number;
    day_from: number;
    day_to: number;
    percent: number;
}
