import { Module } from '@nestjs/common';

import { CarRepository } from './car.repository';
import { DiscountService } from './../discount/discount.service';
import { DbModule } from './../db/db.module';
import { CarController } from './controllers/car.controller';
import { CarService } from './services/car.service';
import { TariffService } from './../tariff/tariff.service';

@Module({
    imports: [DbModule],
    controllers: [CarController],
    providers: [CarService, TariffService, DiscountService, CarRepository],
})
export class CarModule {}
