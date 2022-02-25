import { IDiscount } from './discount.interface';
import { DiscountService } from './discount.service';
/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param } from '@nestjs/common';

@Controller('discount')
export class DiscountController {
    constructor(private readonly service: DiscountService) {}

    @Get(':count')
    async getOne(@Param('count') count: number): Promise<IDiscount> {
        return await this.service.getOneDiscount(count);
    }

    @Get()
    async getAll(): Promise<IDiscount[]> {
        return await this.service.getAllDiscounts();
    }
}
