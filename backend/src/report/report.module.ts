import { Module } from '@nestjs/common';

import { ReportController } from './controllers/report.controller';
import { ReportService } from './services/report.service';
import { ReportRepository } from './report.repository';

@Module({
    controllers: [ReportController],
    providers: [ReportService, ReportRepository],
})
export class ReportModule {}
