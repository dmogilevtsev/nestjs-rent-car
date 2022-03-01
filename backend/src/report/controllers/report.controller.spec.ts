import { ReportController } from './report.controller';
import { ReportService } from '../services/report.service';
import { Test, TestingModule } from '@nestjs/testing';

const ReportServiceMock = {
    report: (dt1?: Date, dt2?: Date, car_id?: number): string => 'HTML',
};

describe('ReportController', () => {
    let controller: ReportController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ReportService],
            controllers: [ReportController],
        })
            .overrideProvider(ReportService)
            .useValue(ReportServiceMock)
            .compile();
        controller = module.get(ReportController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
