import { Controller, Get, Param } from '@nestjs/common';

import { IDiscount } from './discount.interface';
import { DiscountService } from './discount.service';

@Controller('discount')
export class DiscountController {
    constructor(private readonly service: DiscountService) {}

    @Get(':count-days')
    async getOne(@Param('count-days') countDays: number): Promise<IDiscount> {
        return await this.service.getOneDiscount(countDays);
    }

    @Get()
    async getAll(): Promise<IDiscount[]> {
        return await this.service.getAllDiscounts();
    }
}
