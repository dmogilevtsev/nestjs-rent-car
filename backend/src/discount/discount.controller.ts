import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
} from '@nestjs/common';

import { IDiscount } from './discount.interface';
import { DiscountService } from './discount.service';

const MIN_COUNT_DAYS = 4;
const MAX_COUNT_DAYS = 30;
@Controller('discount')
export class DiscountController {
    constructor(private readonly service: DiscountService) {}

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

    @Get()
    async getAll(): Promise<IDiscount[]> {
        return await this.service.getAllDiscounts();
    }
}
