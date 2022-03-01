import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { DiscountService } from '../services/discount.service';
import { IDiscount } from '../entities/discount.interface';

@ApiTags('Discount Controller')
@Controller('discount')
export class DiscountController {
    constructor(private readonly service: DiscountService) {}

    @ApiResponse({
        description: 'Get one discount',
        status: 200,
    })
    @Get(':count_days')
    async getOne(@Param('count_days') countDays: number): Promise<IDiscount> {
        return await this.service.getOneDiscount(countDays);
    }

    @ApiResponse({
        description: 'Get all discounts',
        status: 200,
    })
    @Get()
    async getAll(): Promise<IDiscount[]> {
        return await this.service.getAllDiscounts();
    }
}
