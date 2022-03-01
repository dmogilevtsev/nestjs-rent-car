import { Module } from '@nestjs/common';

import { DiscountController } from './controllers/discount.controller';
import { DiscountService } from './services/discount.service';
import { DiscountRepository } from './discount.repository';

@Module({
    controllers: [DiscountController],
    providers: [DiscountService, DiscountRepository],
})
export class DiscountModule {}
