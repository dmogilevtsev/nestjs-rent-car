import { HttpException, HttpStatus } from '@nestjs/common';
import { isAfter, addDays, isBefore, isWeekend } from 'date-fns';
import { Test, TestingModule } from '@nestjs/testing';

import { DiscountService } from './../../discount/discount.service';
import { DatabaseService } from './../../db/database.service';
import { TariffService } from './../../tariff/tariff.service';
import { ISession } from './../../session/session.interface';
import { CarRepository } from './../car.repository';
import { ICar } from './../entities/car.interface';
import { Car } from '../entities/car.entity';
import { CarService } from './car.service';

const cars: ICar[] = [
    {
        id: 1,
        brand: 'Audi',
        model: 'A2',
        gos: 'А121АА123',
        VIN: '4Y1SL65848Z411435',
    },
    {
        id: 2,
        brand: 'Audi',
        model: 'A3',
        gos: 'А122АА123',
        VIN: '4Y1SL65848Z411436',
    },
    {
        id: 3,
        brand: 'Audi',
        model: 'A4',
        gos: 'А123АА123',
        VIN: '4Y1SL65848Z411437',
    },
    {
        id: 4,
        brand: 'Audi',
        model: 'A5',
        gos: 'А124АА123',
        VIN: '4Y1SL65848Z411438',
    },
    {
        id: 5,
        brand: 'Audi',
        model: 'A6',
        gos: 'А125АА123',
        VIN: '4Y1SL65848Z411439',
    },
];

const carInSession: ISession[] = [
    {
        id: 1,
        car_id: 3,
        discount_id: 1,
        dt_from: new Date('2022-02-21'),
        dt_to: new Date('2022-02-25'),
        tariff_id: 1,
        cost: 1282.5,
    },
];

const mockCarService = {
    getAllCars: jest.fn((): Car[] => cars),
    getOneCar: jest.fn((id: number): Car => cars.find(car => car.id === id)),
    carIsAvailable: jest.fn((car_id: number, dt_from: Date): boolean => {
        if (
            carInSession.filter(
                car =>
                    car.car_id === car_id &&
                    isAfter(dt_from, addDays(car.dt_from, -1)) &&
                    isBefore(dt_from, addDays(car.dt_to, 1)),
            ).length > 0 ||
            isWeekend(dt_from)
        ) {
            throw new HttpException(
                'This car is in rent now.',
                HttpStatus.BAD_REQUEST,
            );
        }
        return true;
    }),
};

describe('[CLASS] CarService', () => {
    let carServiceMock: CarService;
    let carService: CarService;
    let carReposirory: CarRepository;
    let tariffService: TariffService;
    let discountService: DiscountService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CarService],
        })
            .overrideProvider(CarService)
            .useValue(mockCarService)
            .compile();
        carServiceMock = module.get<CarService>(CarService);
        carReposirory = new CarRepository({} as DatabaseService);
        tariffService = new TariffService({} as DatabaseService);
        discountService = new DiscountService({} as DatabaseService);
        carService = new CarService(
            carReposirory,
            tariffService,
            discountService,
        );
    });
    it('CarService MOCK should be defined', () => {
        expect(carServiceMock).toBeDefined();
    });
    it('CarService should be defined', () => {
        expect(carService).toBeDefined();
    });
    describe('[METHOD] getAllCars', () => {
        let _cars: ICar[] = [];
        beforeEach(async () => {
            _cars = await carServiceMock.getAllCars();
        });
        it('should returned cars typeof Car', () => {
            expect(_cars).toMatchObject<ICar>(new Car());
        });
    });
    describe('[METHOD] getOneCar', () => {
        let id: number;
        let _car: ICar;
        beforeEach(async () => {
            id = 2;
            _car = await carServiceMock.getOneCar(id);
        });
        it('the returned value not falsy', () => {
            expect(_car).not.toBeFalsy();
        });
        it(`the returned value must be equal the array element with the same id`, () => {
            const car = cars.find(car => car.id === id);
            expect(_car).toEqual(car);
        });
    });
    describe('[METHOD] carIsAvailable', () => {
        let car_id: number;
        let dt_from: Date;
        describe('(2022-02-21)', () => {
            beforeEach(() => {
                car_id = 3;
                dt_from = new Date('2022-02-21');
            });
            it('Should return error "This car is in rent now."', () => {
                expect(() =>
                    carServiceMock.carIsAvailable(car_id, dt_from),
                ).toThrow(/This car is in rent now./);
            });
        });
        describe('(2022-02-26)', () => {
            beforeEach(() => {
                car_id = 3;
                dt_from = new Date('2022-02-26');
            });
            it('Should return error "This car is in rent now." becouse it weekend', () => {
                expect(() =>
                    carServiceMock.carIsAvailable(car_id, dt_from),
                ).toThrow(/This car is in rent now./);
            });
        });
        describe('(2022-02-28)', () => {
            beforeEach(() => {
                car_id = 3;
                dt_from = new Date('2022-02-28');
            });
            it('Should return true', () => {
                expect(
                    carServiceMock.carIsAvailable(car_id, dt_from),
                ).toBeTruthy();
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
    describe('[METHOD] periodLaseThenThirty', () => {
        let dt_from: Date;
        let dt_to: Date;
        describe('from 2022-02-28 - to 2022-04-04', () => {
            beforeEach(() => {
                dt_from = new Date('2022-02-28');
                dt_to = new Date('2022-04-04');
            });
            it('Should be false', () => {
                expect(() => {
                    carService.periodLaseThenThirty(dt_from, dt_to);
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
                    carService.periodLaseThenThirty(dt_from, dt_to),
                ).toBeTruthy();
            });
        });
    });
});
