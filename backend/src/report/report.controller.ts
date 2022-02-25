import { ReportService } from './report.service';
/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { GetReportParamsDto } from './dto/get-report-params.dto';

@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Get()
    async generateReport(
        @Res() res: Response,
        @Query() { dt_from, dt_to }: GetReportParamsDto,
    ): Promise<any> {
        const report = await this.reportService.report(
            new Date(dt_from),
            new Date(dt_to),
        );
        res.send(report);
    }
}
