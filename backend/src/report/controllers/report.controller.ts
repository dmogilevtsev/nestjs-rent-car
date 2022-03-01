import { Controller, Get, Res, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { addDays } from 'date-fns';

import { GetReportParamsDto } from '../dto/get-report-params.dto';
import { ReportService } from '../services/report.service';
import { MAX_DAY } from '../../constants';

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
        const dt1 = dt_from ? new Date(dt_from) : addDays(new Date(), -MAX_DAY);
        const dt2 = dt_to ? new Date(dt_to) : new Date();
        const report = await this.reportService.report(dt1, dt2, car_id);
        res.send(report);
    }
}
