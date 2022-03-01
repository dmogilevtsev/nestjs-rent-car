import { Test, TestingModule } from '@nestjs/testing';

import { ITariff } from '../../tariff/entities/tarif.interface';
import { CreateCarDto } from '../dto/create-car.dto';
import { TariffService } from '../../tariff/services/tariff.service';
import { CarRepository } from './../car.repository';
import { ICar } from './../entities/car.interface';
import { CarService } from './car.service';
import { Car } from '../entities/car.entity';
import { DiscountService } from '../../discount/services/discount.service';
import { IDiscount } from '../../discount/entities/discount.interface';

const mockCars: ICar[] = [
    {
        id: 1,
        brand: 'Audi',
        model: 'A2',
        gos: 'А121АА123',
        vin: '4Y1SL65848Z411435',
    },
    {
        id: 2,
        brand: 'Audi',
        model: 'A3',
        gos: 'А122АА123',
        vin: '4Y1SL65848Z411436',
    },
];

const mockNewCar: ICar = {
    id: 3,
    brand: 'Volvo',
    model: 'XC 90',
    gos: 'А123АА123',
    vin: '1234567890',
};

const CarRepositoryMock = {
    create: jest.fn(
        ({ brand, model, gos, vin }: CreateCarDto): ICar => mockNewCar,
    ),
    findAll: jest.fn((): ICar[] => mockCars),
    findOne: jest.fn((id: number): ICar => mockCars[0]),
    carIsAvailable: (car_id: number, dt_from: Date) => true,
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

describe('[CLASS] CarService', () => {
    let carService: CarService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CarService,
                CarRepository,
                TariffService,
                DiscountService,
            ],
        })
            .overrideProvider(CarRepository)
            .useValue(CarRepositoryMock)
            .overrideProvider(TariffService)
            .useValue(TariffServiceMock)
            .overrideProvider(DiscountService)
            .useValue(DiscountServiceMock)
            .compile();
        carService = module.get(CarService);
    });
    it('CarService should be defined', () => {
        expect(carService).toBeDefined();
    });
    describe('[METHOD] getAllCars', () => {
        let _cars: ICar[] = [];
        beforeEach(async () => {
            _cars = await carService.getAllCars();
        });
        it('should returned cars typeof Car', () => {
            expect(_cars).toMatchObject<ICar>(new Car());
        });
    });
    describe('[METHOD] getOneCar', () => {
        let id: number;
        let _car: ICar;
        beforeEach(async () => {
            _car = await carService.getOneCar(1);
        });
        it('the returned value not falsy', () => {
            expect(_car).not.toBeFalsy();
        });
        it(`the returned value must be equal the array element with the same id`, () => {
            expect(_car?.id).toBe(1);
        });
    });
    describe('[METHOD] rentPrice', () => {
        let dtFrom: Date;
        let dtTo: Date;
        describe('dateFrom: 2022-05-01, dateTo: 2022-05-35', () => {
            beforeEach(() => {
                dtFrom = new Date('2022-05-01');
                dtTo = new Date('2022-05-35');
            });
            it('should be error "Incorrect date"', async () => {
                await expect(
                    async () =>
                        await carService.rentPrice({
                            dt_from: dtFrom,
                            dt_to: dtTo,
                            tariff_id: 1,
                            car_id: 1,
                        }),
                ).rejects.toThrow(/Incorrect date/);
            });
        });
        describe('dateFrom: 2022-05-20, dateTo: 2022-05-10', () => {
            beforeEach(() => {
                dtFrom = new Date('2022-05-20');
                dtTo = new Date('2022-05-10');
            });
            it('should be error "Date from can not be more then date to!"', async () => {
                await expect(
                    async () =>
                        await carService.rentPrice({
                            dt_from: dtFrom,
                            dt_to: dtTo,
                            tariff_id: 1,
                            car_id: 1,
                        }),
                ).rejects.toThrow(/Date from can not be more then date to!/);
            });
        });
        describe('dateFrom: 2022-05-07, dateTo: 2022-05-08', () => {
            beforeEach(() => {
                dtFrom = new Date('2022-05-07');
                dtTo = new Date('2022-05-08');
            });
            it('should be error "You can\'t rent a car on weekends"', async () => {
                await expect(
                    async () =>
                        await carService.rentPrice({
                            dt_from: dtFrom,
                            dt_to: dtTo,
                            tariff_id: 1,
                            car_id: 1,
                        }),
                ).rejects.toThrow(/You can't rent a car on weekends/);
            });
        });
        describe('dateFrom: 2022-05-02, dateTo: 2022-05-05', () => {
            beforeEach(() => {
                dtFrom = new Date('2022-05-02');
                dtTo = new Date('2022-05-05');
            });
            it('should be return 1026', async () => {
                const result = await carService.rentPrice({
                    dt_from: dtFrom,
                    dt_to: dtTo,
                    tariff_id: 1,
                    car_id: 1,
                });
                expect(result).toBe(1026);
            });
        });
    });
    describe('[METHOD] calculateRentPrice', () => {
        let daysCount: number;
        let price: number;
        let percent: number | null;
        describe('2 days, discount 0%', () => {
            beforeEach(() => {
                daysCount = 2;
                percent = null;
            });
            it(`with the 1 tariff (270 ₽ в день за 200 км в день) must return 540`, () => {
                price = 270;
                const total = carService.calculateRentPrice(
                    daysCount,
                    price,
                    percent,
                );
                expect(total).toBe(540);
            });
            it(`with the 2 tariff (330 ₽ в день за 350 км в день) must return 660`, () => {
                price = 330;
                const total = carService.calculateRentPrice(
                    daysCount,
                    price,
                    percent,
                );
                expect(total).toBe(660);
            });
            it(`with the 3 tariff (390 ₽ в день за 500 км в день) must return 780`, () => {
                price = 390;
                const total = carService.calculateRentPrice(
                    daysCount,
                    price,
                    percent,
                );
                expect(total).toBe(780);
            });
        });
        describe('4 days, discount 5%', () => {
            beforeEach(() => {
                daysCount = 4;
                percent = 5;
            });
            it(`with the 1 tariff (270 ₽ в день за 200 км в день) must return 1026`, () => {
                price = 270;
                const total = carService.calculateRentPrice(
                    daysCount,
                    price,
                    percent,
                );
                expect(total).toBe(1026);
            });
            it(`with the 2 tariff (330 ₽ в день за 350 км в день) must return 1254`, () => {
                price = 330;
                const total = carService.calculateRentPrice(
                    daysCount,
                    price,
                    percent,
                );
                expect(total).toBe(1254);
            });
            it(`with the 3 tariff (390 ₽ в день за 500 км в день) must return 1482`, () => {
                price = 390;
                const total = carService.calculateRentPrice(
                    daysCount,
                    price,
                    percent,
                );
                expect(total).toBe(1482);
            });
        });
        describe('11 days, discount 10%', () => {
            beforeEach(() => {
                daysCount = 11;
                percent = 10;
            });
            it(`with the 1 tariff (270 ₽ в день за 200 км в день) must return 2673`, () => {
                price = 270;
                const total = carService.calculateRentPrice(
                    daysCount,
                    price,
                    percent,
                );
                expect(total).toBe(2673);
            });
            it(`with the 2 tariff (330 ₽ в день за 350 км в день) must return 3267`, () => {
                price = 330;
                const total = carService.calculateRentPrice(
                    daysCount,
                    price,
                    percent,
                );
                expect(total).toBe(3267);
            });
            it(`with the 3 tariff (390 ₽ в день за 500 км в день) must return 3861`, () => {
                price = 390;
                const total = carService.calculateRentPrice(
                    daysCount,
                    price,
                    percent,
                );
                expect(total).toBe(3861);
            });
        });
        describe('21 days, discount 15%', () => {
            beforeEach(() => {
                daysCount = 21;
                percent = 15;
            });
            it(`with the 1 tariff (270 ₽ в день за 200 км в день) must return 4819.5`, () => {
                price = 270;
                const total = carService.calculateRentPrice(
                    daysCount,
                    price,
                    percent,
                );
                expect(total).toBe(4819.5);
            });
            it(`with the 2 tariff (330 ₽ в день за 350 км в день) must return 5890.5`, () => {
                price = 330;
                const total = carService.calculateRentPrice(
                    daysCount,
                    price,
                    percent,
                );
                expect(total).toBe(5890.5);
            });
            it(`with the 3 tariff (390 ₽ в день за 500 км в день) must return 6961.5`, () => {
                price = 390;
                const total = carService.calculateRentPrice(
                    daysCount,
                    price,
                    percent,
                );
                expect(total).toBe(6961.5);
            });
        });
    });
    describe('[METHOD] periodLessThenThirty', () => {
        let dt_from: Date;
        let dt_to: Date;
        describe('from 2022-02-28 - to 2022-04-04', () => {
            beforeEach(() => {
                dt_from = new Date('2022-02-28');
                dt_to = new Date('2022-04-04');
            });
            it('Should be false', () => {
                expect(() => {
                    carService.periodLessThenThirty(dt_from, dt_to);
                }).toThrow(/Maximum rental period exceeded/);
            });
        });
        describe('from 2022-02-28 - to 2022-03-04', () => {
            beforeEach(() => {
                dt_from = new Date('2022-02-28');
                dt_to = new Date('2022-03-04');
            });
            it('Should be true', () => {
                expect(
                    carService.periodLessThenThirty(dt_from, dt_to),
                ).toBeTruthy();
            });
        });
    });
    describe('[METHOD] carIsAvailable', () => {
        it('Should be true', async () => {
            const result = await carService.carIsAvailable(
                1,
                new Date('2022-05-02'),
            );
            expect(result).toBeTruthy();
        });
    });
    describe('[METHOD] createCar', () => {
        let car: CreateCarDto;
        beforeEach(() => {
            car = {
                brand: 'Volvo',
                model: 'XC 90',
                gos: 'А123АА123',
                vin: '1234567890',
            };
        });
        it('Should be returned id = 3', async () => {
            const result = await carService.createCar(car);
            expect(result?.id).toBe(3);
        });
        it('Should be equal mockNewCar', async () => {
            const result = await carService.createCar(car);
            expect(result).toEqual(mockNewCar);
        });
    });
});
