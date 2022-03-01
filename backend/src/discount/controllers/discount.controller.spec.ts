import { Test, TestingModule } from '@nestjs/testing';

import { IDiscount } from './../entities/discount.interface';
import { DiscountService } from './../services/discount.service';
import { DiscountController } from './discount.controller';

const discountMockData: IDiscount[] = [
    { id: 1, day_from: 3, day_to: 5, percent: 5 },
];

const DiscountServiceMock = {
    getAllDiscounts: jest.fn((): IDiscount[] => discountMockData),
    getOneDiscount: jest.fn((id: number): IDiscount => discountMockData[0]),
};

describe('DiscountController', () => {
    let discountController: DiscountController;
    let discountService: DiscountService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DiscountService],
            controllers: [DiscountController],
        })
            .overrideProvider(DiscountService)
            .useValue(DiscountServiceMock)
            .compile();
        discountController = module.get(DiscountController);
        discountService = module.get(DiscountService);
    });

    describe('getAllCars', () => {
        it('should return an array of discount', async () => {
            jest.spyOn(discountService, 'getAllDiscounts').mockImplementation(
                async () => discountMockData,
            );

            expect(await discountController.getAll()).toBe(discountMockData);
        });
    });

    describe('getOneCar', () => {
        it('should return an discount', async () => {
            jest.spyOn(discountService, 'getOneDiscount').mockImplementation(
                async () => discountMockData[0],
            );

            expect(await discountController.getOne(4)).toEqual(
                discountMockData[0],
            );
        });
    });
});
