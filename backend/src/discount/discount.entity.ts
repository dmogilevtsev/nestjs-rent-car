import { IDiscount } from './discount.interface';
export class Discount implements IDiscount {
    id: number;
    period: string;
    percent: number;
}
