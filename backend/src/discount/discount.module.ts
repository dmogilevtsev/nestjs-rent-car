import { Module } from '@nestjs/common';

import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';
import { DbModule } from './../db/db.module';

@Module({
    imports: [DbModule],
    controllers: [DiscountController],
    providers: [DiscountService],
})
export class DiscountModule {}
