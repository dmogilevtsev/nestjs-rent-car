import { ITariff } from './tarif.interface';

export class Tariff implements ITariff {
    id: number;
    price: number;
    kmperday: number;
}
