import { Injectable, Logger } from '@nestjs/common';

import { IDiscount } from './entities/discount.interface';
import { DatabaseService } from '../db/database.service';

@Injectable()
export class DiscountRepository {
    private readonly log = new Logger(DiscountRepository.name);
    constructor(private readonly db: DatabaseService) {}

    async getAllDiscounts(): Promise<IDiscount[]> {
        try {
            const getDiscounts = /* sql */ `select * from discount`;
            return await this.db.executeQuery<IDiscount>(getDiscounts);
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
            this.log.warn('[getOneDiscount]', error);
        }
    }
}
