import { DbModule } from './../db/db.module';
import { Module } from '@nestjs/common';

import { ReportService } from './report.service';
import { ReportController } from './report.controller';

@Module({
    imports: [DbModule],
    controllers: [ReportController],
    providers: [ReportService],
})
export class ReportModule {}
