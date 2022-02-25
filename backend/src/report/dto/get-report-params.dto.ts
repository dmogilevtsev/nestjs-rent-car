import { ApiProperty } from '@nestjs/swagger';

export class GetReportParamsDto {
    @ApiProperty()
    dt_from: Date;
    @ApiProperty()
    dt_to: Date;
}
