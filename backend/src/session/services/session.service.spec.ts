import { Test, TestingModule } from '@nestjs/testing';

import { DiscountService } from '../../discount/services/discount.service';
import { TariffService } from './../../tariff/services/tariff.service';
import { IDiscount } from '../../discount/entities/discount.interface';
import { ITariff } from '../../tariff/entities/tarif.interface';
import { CarService } from './../../car/services/car.service';
import { SessionRepository } from './../session.repository';
import { ISession } from './../entities/session.interface';
import { ICar } from './../../car/entities/car.interface';
import { SessionService } from './session.service';

// '2022-02-02', '2022-02-07', 1, 1, 2, 1458
const sessionsMock: ISession[] = [
    {
        id: 1,
        dt_from: new Date('2022-02-02'),
        dt_to: new Date('2022-02-07'),
        car_id: 1,
        tariff_id: 1,
        discount_id: 2,
        cost: 1458,
    },
];

const SessionRepositoryMock = {
    getSession: jest.fn((id: number): ISession => sessionsMock[0]),
    getSessions: jest.fn((): ISession[] => sessionsMock),
    createSession: jest.fn(
        (
            dtFrom: Date,
            dtTo: Date,
            car_id: number,
            tariff_id: number,
        ): ISession => sessionsMock[0],
    ),
};

const TariffServiceMock = {
    getOneTariff: jest.fn(
        (tariff_id: number): ITariff => ({
            id: 1,
            price: 270,
            kmPerDay: 200,
        }),
    ),
};

const DiscountServiceMock = {
    getOneDiscount: jest.fn(
        (daysCount: number): IDiscount => ({
            id: 1,
            percent: 5,
            day_from: 3,
            day_to: 5,
        }),
    ),
};

const CarServiceMock = {
    carIsAvailable: jest.fn((car_id: number, dt_from: Date): boolean => true),
    getOneCar: jest.fn(
        (car_id: number): ICar => ({
            id: 1,
            brand: 'Volvo',
            model: 'XC 90',
            gos: 'A123AA123',
            vin: '1234567890',
        }),
    ),
};

describe('[CLASS] SessionService', () => {
    let sessionService: SessionService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SessionService,
                SessionRepository,
                TariffService,
                CarService,
                DiscountService,
            ],
        })
            .overrideProvider(SessionRepository)
            .useValue(SessionRepositoryMock)
            .overrideProvider(TariffService)
            .useValue(TariffServiceMock)
            .overrideProvider(DiscountService)
            .useValue(DiscountServiceMock)
            .overrideProvider(CarService)
            .useValue(CarServiceMock)
            .compile();
        sessionService = module.get(SessionService);
    });
    it('should be defined', () => {
        expect(sessionService).toBeDefined();
    });
    describe('[METHOD] getOneSession', () => {
        it('should return id = 1', async () => {
            const res = await sessionService.getOneSession(1);
            expect(res.id).toBe(1);
        });
        it('should be equal to ITariff from mock data', async () => {
            const res = await sessionService.getOneSession(1);
            expect(res).toEqual(sessionsMock[0]);
        });
    });

    describe('[METHOD] getAllSessions', () => {
        it('should return id = 1', async () => {
            const res = await sessionService.getAllSessions();
            expect(res[0].id).toBe(1);
        });
        it('should be equal to ITariff from mock data', async () => {
            const res = await sessionService.getAllSessions();
            expect(res[0]).toEqual(sessionsMock[0]);
        });
    });

    describe('[METHOD] createSession', () => {
        let dtFrom: Date;
        let dtTo: Date;
        describe('[ERRORS]', () => {
            describe('dtFrom = 2022-02-34, dtTo = 2022-02-35', () => {
                beforeEach(() => {
                    dtFrom = new Date('2022-02-34');
                    dtTo = new Date('2022-02-35');
                });
                it('should be "Incorrect date"', async () => {
                    await expect(
                        async () =>
                            await sessionService.createSession({
                                dt_from: dtFrom,
                                dt_to: dtTo,
                                car_id: 1,
                                tariff_id: 1,
                            }),
                    ).rejects.toThrow(/Incorrect date/);
                });
            });
            describe('dtFrom = 2022-02-28, dtTo = 2022-02-25', () => {
                beforeEach(() => {
                    dtFrom = new Date('2022-02-28');
                    dtTo = new Date('2022-02-25');
                });
                it('should be "Date from can not be more then date to!"', async () => {
                    await expect(
                        async () =>
                            await sessionService.createSession({
                                dt_from: dtFrom,
                                dt_to: dtTo,
                                car_id: 1,
                                tariff_id: 1,
                            }),
                    ).rejects.toThrow(
                        /Date from can not be more then date to!/,
                    );
                });
            });
            describe('dtFrom = 2022-02-26, dtTo = 2022-02-27', () => {
                beforeEach(() => {
                    dtFrom = new Date('2022-02-26');
                    dtTo = new Date('2022-02-27');
                });
                it('should be "You can\'t rent a car on weekends"', async () => {
                    await expect(
                        async () =>
                            await sessionService.createSession({
                                dt_from: dtFrom,
                                dt_to: dtTo,
                                car_id: 1,
                                tariff_id: 1,
                            }),
                    ).rejects.toThrow(/You can't rent a car on weekends/);
                });
            });
        });
    });
});
