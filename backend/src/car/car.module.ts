import { Module } from '@nestjs/common';

import { DiscountService } from '../discount/services/discount.service';
import { DiscountRepository } from './../discount/discount.repository';
import { TariffService } from '../tariff/services/tariff.service';
import { TariffRepository } from './../tariff/tariff.repository';
import { CarController } from './controllers/car.controller';
import { CarService } from './services/car.service';
import { CarRepository } from './car.repository';

@Module({
    controllers: [CarController],
    providers: [
        CarService,
        CarRepository,
        TariffService,
        DiscountService,
        DiscountRepository,
        TariffRepository,
    ],
})
export class CarModule {}
