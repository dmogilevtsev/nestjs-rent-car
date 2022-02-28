import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Res,
    Query,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { addDays, isDate, isValid } from 'date-fns';

import { MAX_DAY } from './../constants';
import { ReportService } from './report.service';
import { GetReportParamsDto } from './dto/get-report-params.dto';

@ApiTags('Report controller')
@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @ApiResponse({
        status: 200,
        description: 'Returned HTML report',
    })
    @Get()
    async generateReport(
        @Res() res: Response,
        @Query() { dt_from, dt_to, car_id }: GetReportParamsDto,
    ): Promise<void> {
        if (!isValid(new Date(dt_from)) || !isValid(new Date(dt_to))) {
            throw new HttpException('Incorrect date', HttpStatus.BAD_REQUEST);
        }
        const dt1 = dt_from ? new Date(dt_from) : addDays(new Date(), -MAX_DAY);
        const dt2 = dt_to ? new Date(dt_to) : new Date();
        const report = await this.reportService.report(dt1, dt2, car_id);
        res.send(report);
    }
}
