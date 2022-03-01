import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSessionDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Date can not be null' })
    dt_from: Date;

    @ApiProperty()
    @IsNotEmpty({ message: 'Date can not be null' })
    dt_to: Date;

    @ApiProperty()
    @IsNotEmpty()
    tariff_id: number;

    @ApiProperty()
    @IsNotEmpty()
    car_id: number;
}
