import { IsNotEmpty } from 'class-validator';

export class CreateSessionDto {
    // @IsDate({ message: 'Invalid date' })
    @IsNotEmpty({ message: 'Date can not be null' })
    dt_from: Date;

    // @IsDate({ message: 'Invalid date' })
    @IsNotEmpty({ message: 'Date can not be null' })
    dt_to: Date;

    tariff_id: number;
    car_id: number;
}
