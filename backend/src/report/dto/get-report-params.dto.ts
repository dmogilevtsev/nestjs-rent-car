import { ApiProperty } from '@nestjs/swagger';

export class GetReportParamsDto {
    @ApiProperty({
        nullable: true,
        required: false,
    })
    dt_from?: Date;
    @ApiProperty({
        nullable: true,
        required: false,
    })
    dt_to?: Date;
    @ApiProperty({
        nullable: true,
        required: false,
    })
    car_id?: number;
}
