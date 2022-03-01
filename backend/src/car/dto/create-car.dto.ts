import { IsNotEmpty } from 'class-validator';

export class CreateCarDto {
    @IsNotEmpty({ message: 'Brand can not be empty' })
    brand: string;
    @IsNotEmpty({ message: 'Model can not be empty' })
    model: string;
    @IsNotEmpty({ message: 'Gos number can not be empty' })
    gos: string;
    @IsNotEmpty({ message: 'VIN number can not be empty' })
    vin: string;
}
