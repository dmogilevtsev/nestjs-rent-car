import { CreateSessionDto } from './../../session/dto/create-session.dto';
import { CreateCarDto } from './../dto/create-car.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { CarService } from './../services/car.service';
import { CarController } from './car.controller';
import { ICar } from '../entities/car.interface';

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

const CarServiceMock = {
    getAllCars: jest.fn((): ICar[] => mockCars),
    getOneCar: jest.fn((id: number): ICar => mockCars[0]),
    createCar: jest.fn((car: CreateCarDto): ICar => mockNewCar),
    rentPrice: jest.fn((createSessionDto: CreateSessionDto): number => 1026),
};

describe('CarController', () => {
    let carController: CarController;
    let carService: CarService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CarService],
            controllers: [CarController],
        })
            .overrideProvider(CarService)
            .useValue(CarServiceMock)
            .compile();
        carController = module.get(CarController);
        carService = module.get(CarService);
    });

    describe('getAllCars', () => {
        it('should return an array of cars', async () => {
            jest.spyOn(carService, 'getAllCars').mockImplementation(
                async () => mockCars,
            );

            expect(await carController.getAllCars()).toBe(mockCars);
        });
    });

    describe('getOneCar', () => {
        it('should return an car', async () => {
            jest.spyOn(carService, 'getOneCar').mockImplementation(
                async () => mockCars[0],
            );

            expect(await carController.getOneCar(1)).toEqual(mockCars[0]);
        });
    });

    describe('createCar', () => {
        it('should return a new car', async () => {
            jest.spyOn(carService, 'createCar').mockImplementation(
                async () => mockNewCar,
            );

            expect(
                await carController.createCar({
                    brand: 'Volvo',
                    model: 'XC 90',
                    gos: 'А123АА123',
                    vin: '1234567890',
                }),
            ).toEqual(mockNewCar);
        });
    });

    describe('rentPrice', () => {
        it('should return cost of rent', async () => {
            jest.spyOn(carService, 'rentPrice').mockImplementation(
                async () => 1026, // 270 * 4 - 5%
            );

            expect(
                await carController.rentPrice({
                    dt_from: new Date('2022-03-01'),
                    dt_to: new Date('2022-03-04'),
                    car_id: 1,
                    tariff_id: 1,
                }),
            ).toBe(1026);
        });
    });
});
