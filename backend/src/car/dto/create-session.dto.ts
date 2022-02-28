import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsOnlyDate } from '../../decorators/is-date.validation';

export class CreateSessionDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Date can not be null' })
    @IsOnlyDate({ message: 'Incorrect date' })
    dt_from: Date;

    @ApiProperty()
    @IsNotEmpty({ message: 'Date can not be null' })
    @IsOnlyDate({ message: 'Incorrect date' })
    dt_to: Date;

    @ApiProperty()
    @IsNotEmpty()
    tariff_id: number;

    @ApiProperty()
    @IsNotEmpty()
    car_id: number;
}
