import { Test, TestingModule } from '@nestjs/testing';
import { IDiscount } from '../entities/discount.interface';

import { DiscountRepository } from './../discount.repository';
import { DiscountService } from './discount.service';

const discountMock: IDiscount[] = [
    { id: 1, day_from: 3, day_to: 5, percent: 5 },
];

const DiscountRepositoryMock = {
    getAllDiscounts: jest.fn((): IDiscount[] => discountMock),
    getOneDiscount: jest.fn((countDays: number): IDiscount => discountMock[0]),
};

describe('[Class] DiscountService', () => {
    let discountService: DiscountService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DiscountService, DiscountRepository],
        })
            .overrideProvider(DiscountRepository)
            .useValue(DiscountRepositoryMock)
            .compile();
        discountService = module.get(DiscountService);
    });
    it('DiscountService should be defined', () => {
        expect(discountService).toBeDefined();
    });
    describe('[METHOD] getOneDiscount', () => {
        let countDays: number;
        it('should returned equal to discountMock[0]', async () => {
            const res = await discountService.getOneDiscount(3);
            expect(res).toEqual(discountMock[0]);
        });
        it('should returned id = 1', async () => {
            const res = await discountService.getOneDiscount(3);
            expect(res?.id).toBe(1);
        });
        describe('[ERROR] should returned error', () => {
            it(`should returned "No discount for a period less than ${countDays} days"`, async () => {
                countDays = 2;
                await expect(
                    async () => await discountService.getOneDiscount(countDays),
                ).rejects.toThrow(/No discount for a period less than 3 day/);
            });
            it(`should returned "No discount for a period less than ${countDays} days"`, async () => {
                countDays = 35;
                await expect(
                    async () => await discountService.getOneDiscount(countDays),
                ).rejects.toThrow(/The rental period cannot exceed 30 days/);
            });
        });
    });
    describe('[METHOD] getAllDiscounts', () => {
        it('shout returned array of IDiscount', async () => {
            const res = await discountService.getAllDiscounts();
            expect(res[0]).toEqual(discountMock[0]);
        });
    });
});
