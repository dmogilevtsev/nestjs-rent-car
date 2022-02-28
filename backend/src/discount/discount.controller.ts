import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { IDiscount } from './discount.interface';
import { DiscountService } from './discount.service';

const MIN_COUNT_DAYS = 4;
const MAX_COUNT_DAYS = 30;

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
        if (countDays < MIN_COUNT_DAYS) {
            throw new HttpException(
                `No discount for a period less than ${MIN_COUNT_DAYS} days`,
                HttpStatus.BAD_REQUEST,
            );
        }
        if (countDays > MAX_COUNT_DAYS) {
            throw new HttpException(
                `The rental period cannot exceed ${MAX_COUNT_DAYS} days`,
                HttpStatus.BAD_REQUEST,
            );
        }
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
