import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateSessionDto } from './../src/session/dto/create-session.dto';
import { CarController } from '../src/car/controllers/car.controller';
import { CreateCarDto } from './../src/car/dto/create-car.dto';
import { ICar } from '../src/car/entities/car.interface';
import { Car } from '../src/car/entities/car.entity';
import { AppModule } from '../src/app.module';

describe('[E2E Tests] CarController', () => {
    let app: NestApplication;
    let carController: CarController;
    let createdCar: ICar;
    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        carController = moduleRef.get(CarController);
    });

    describe('getAllCars', () => {
        let cars: ICar[];
        beforeEach(async () => {
            cars = await carController.getAllCars();
        });
        it('should be Car', () => {
            expect(cars[0]).toMatchObject<ICar>(new Car());
        });
    });

    describe('getOneCar', () => {
        let car: ICar;
        describe('with id = 1', () => {
            beforeEach(async () => {
                car = await carController.getOneCar(1);
            });
            it('should be not null', () => {
                expect(car).not.toBeNull();
            });
            it('should be Car', () => {
                expect(car).toMatchObject<ICar>(new Car());
            });
            it('id should be equal 1', () => {
                expect(car?.id).toBe(1);
            });
        });
        describe('with id = 2', () => {
            beforeEach(async () => {
                car = await carController.getOneCar(2);
            });
            it('should be not null', () => {
                expect(car).not.toBeNull();
            });
            it('id should be equal 2', () => {
                expect(car?.id).toBe(2);
            });
            it('id should be not equal 1', () => {
                expect(car?.id).not.toBe(1);
            });
        });
    });

    describe('createCar', () => {
        let carDto: CreateCarDto;
        beforeEach(async () => {
            carDto = {
                brand: 'Niva',
                model: 'Shevrolet',
                gos: 'А321ББ123',
                vin: '0987654321',
            };
            createdCar = await carController.createCar(carDto);
        });
        it('should be not null', () => {
            expect(createdCar).not.toBeNull();
        });
        it('brand from new car should be equal brand from carDto', () => {
            expect(createdCar?.brand).toBe(carDto.brand);
        });
        it('should be have ID', () => {
            expect(createdCar.id).not.toBeNull();
        });
        it('id should be greater than 1', () => {
            expect(createdCar.id).toBeGreaterThan(1);
        });
    });

    describe('rentPrice', () => {
        let sessioinDto: CreateSessionDto;
        let rentPrice;
        beforeEach(async () => {
            sessioinDto = {
                car_id: createdCar.id,
                dt_from: new Date('2022-03-01'),
                dt_to: new Date('2022-03-04'),
                tariff_id: 2,
            };
            rentPrice = await carController.rentPrice(sessioinDto);
        });
        it('rentPrice should be 1254', () => {
            expect(rentPrice).toBe(1254);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
