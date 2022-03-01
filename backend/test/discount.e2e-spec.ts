import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { DiscountController } from './../src/discount/controllers/discount.controller';
import { IDiscount } from './../src/discount/entities/discount.interface';
import { Discount } from './../src/discount/entities/discount.entity';
import { AppModule } from '../src/app.module';

describe('[E2E Tests] DiscountController', () => {
    let app: NestApplication;
    let controller: DiscountController;
    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        controller = moduleRef.get(DiscountController);
    });

    describe('getAll', () => {
        let discounts: IDiscount[];
        beforeEach(async () => {
            discounts = await controller.getAll();
        });
        it('should be Discount', () => {
            expect(discounts[0]).toMatchObject<IDiscount>(new Discount());
        });
    });

    describe('getOne', () => {
        let discount: IDiscount;
        describe('with count_days < 3', () => {
            it('should be error "No discount for a period less than 3 day"', async () => {
                await expect(async () => {
                    await controller.getOne(1);
                }).rejects.toThrow(/No discount for a period less than 3 day/);
            });
        });
        describe('with count_days >= 3 and <= 5', () => {
            beforeEach(async () => {
                discount = await controller.getOne(4);
            });
            it('should be not null', () => {
                expect(discount).not.toBeNull();
            });
            it('should be Discount', () => {
                expect(discount).toMatchObject<IDiscount>(new Discount());
            });
            it('id should be equal 1', () => {
                expect(discount?.id).toBe(1);
            });
            it('discount should be equal 5%', () => {
                expect(discount?.percent).toBe(5);
            });
        });
        describe('with count_days >= 6 and <= 14', () => {
            beforeEach(async () => {
                discount = await controller.getOne(10);
            });
            it('id should be equal 2', () => {
                expect(discount?.id).toBe(2);
            });
            it('discount should be equal 10%', () => {
                expect(discount?.percent).toBe(10);
            });
        });
        describe('with count_days >= 15 and <= 30', () => {
            beforeEach(async () => {
                discount = await controller.getOne(20);
            });
            it('id should be equal 3', () => {
                expect(discount?.id).toBe(3);
            });
            it('discount should be equal 15%', () => {
                expect(discount?.percent).toBe(15);
            });
        });
        describe('with count_days > 30', () => {
            it('should be error "The rental period cannot exceed 30 days"', async () => {
                await expect(async () => {
                    await controller.getOne(35);
                }).rejects.toThrow(/The rental period cannot exceed 30 days/);
            });
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
