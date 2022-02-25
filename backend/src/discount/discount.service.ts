import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';

import { DatabaseService } from './../db/database.service';
import { IDiscount } from './discount.interface';

const MIN_COUNT_DAYS = 3;
const MAX_COUNT_DAYS = 30;
@Injectable()
export class DiscountService {
    private readonly log: Logger = new Logger(DiscountService.name);
    constructor(private readonly db: DatabaseService) {}

    async getAllDiscounts(): Promise<IDiscount[]> {
        try {
            const getDiscounts = /* sql */ `select * from discount`;
            const result = await this.db.executeQuery<IDiscount>(getDiscounts);
            return result;
        } catch (error) {
            this.log.warn('[getAllDiscounts]', error);
        }
    }

    async getOneDiscount(countDays: number): Promise<IDiscount> {
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
        try {
            const getDiscount = /* sql */ `select * from discount where $1 between day_from and day_to;`;
            const result = await this.db.executeQuery<IDiscount>(getDiscount, [
                countDays,
            ]);
            return result[0];
        } catch (error) {
            this.log.warn('[getOneDiscount]', error);
        }
    }
}
