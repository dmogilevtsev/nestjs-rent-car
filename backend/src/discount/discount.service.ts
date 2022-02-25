import { Injectable, Logger } from '@nestjs/common';

import { DatabaseService } from './../db/database.service';
import { IDiscount } from './discount.interface';

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
        try {
            const getDiscount = /* sql */ `select * from discount where $1 between day_from and day_to;`;
            const result = await this.db.executeQuery<IDiscount>(getDiscount, [
                countDays,
            ]);
            return result[0];
        } catch (error) {
            this.log.warn('[getAllDiscounts]', error);
        }
    }
}
