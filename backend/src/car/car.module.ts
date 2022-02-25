import { DiscountService } from './../discount/discount.service';
import { Module } from '@nestjs/common';

import { DbModule } from './../db/db.module';
import { CarController } from './controllers/car.controller';
import { CarService } from './services/car.service';
import { TariffService } from './../tariff/tariff.service';

@Module({
    imports: [DbModule],
    controllers: [CarController],
    providers: [CarService, TariffService, DiscountService],
})
export class CarModule {}
