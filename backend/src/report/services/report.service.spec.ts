import { ReportRepository } from './../report.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { IAverageCarLoadByDayResponse } from './../reposrt.interface';

const averageCarLoadByDayData: IAverageCarLoadByDayResponse[] = [
    {
        car: 'Some car',
        dt_from: new Date('2022-03-01'),
        dt_to: new Date('2022-03-03'),
    },
];

const ReportRepositoryMock = {
    averageCarLoadByDay: jest.fn(
        (
            dtFrom: string,
            dtTo: string,
            car_id?: number,
        ): IAverageCarLoadByDayResponse[] => averageCarLoadByDayData,
    ),
};

describe('[SERVICE] ReportService', () => {
    let reportService: ReportService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ReportService, ReportRepository],
        })
            .overrideProvider(ReportRepository)
            .useValue(ReportRepositoryMock)
            .compile();
        reportService = module.get(ReportService);
    });
    it('should be defined', () => {
        expect(reportService).toBeDefined();
    });
    describe('[METHOD] averageCarLoadByDay', () => {
        it('should return car = "Some car"', async () => {
            const res = await reportService.averageCarLoadByDay(
                new Date('2022-03-01'),
                new Date('2022-03-03'),
                5,
            );
            expect(res[0].car).toBe('Some car');
        });
        it('should return equal to IAverageCarLoadByDayResponse', async () => {
            const res = await reportService.averageCarLoadByDay(
                new Date('2022-03-01'),
                new Date('2022-03-03'),
                5,
            );
            expect(res[0]).toEqual(averageCarLoadByDayData[0]);
        });
    });
});
