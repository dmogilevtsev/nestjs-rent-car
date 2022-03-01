import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';

import { DiscountRepository } from './../discount.repository';
import { IDiscount } from '../entities/discount.interface';

const MIN_COUNT_DAYS = 3;
const MAX_COUNT_DAYS = 30;

@Injectable()
export class DiscountService {
    private readonly log: Logger = new Logger(DiscountService.name);
    constructor(private readonly repo: DiscountRepository) {}

    async getAllDiscounts(): Promise<IDiscount[]> {
        return await this.repo.getAllDiscounts();
    }

    async getOneDiscount(countDays: number): Promise<IDiscount> {
        if (countDays < MIN_COUNT_DAYS) {
            throw new HttpException(
                `No discount for a period less than ${MIN_COUNT_DAYS} day`,
                HttpStatus.BAD_REQUEST,
            );
        }
        if (countDays > MAX_COUNT_DAYS) {
            throw new HttpException(
                `The rental period cannot exceed ${MAX_COUNT_DAYS} days`,
                HttpStatus.BAD_REQUEST,
            );
        }
        return await this.repo.getOneDiscount(countDays);
    }
}
