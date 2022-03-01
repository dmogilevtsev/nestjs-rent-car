import { ICar } from './car.interface';

export class Car implements ICar {
    id: number;
    brand: string;
    model: string;
    gos: string;
    vin: string;
}
