import { Module } from '@nestjs/common';

import { CarService } from './../car/services/car.service';
import { CarRepository } from './../car/car.repository';
import { DbModule } from './../db/db.module';
import { SessionController } from './session.controller';
import { DiscountService } from './../discount/discount.service';
import { SessionService } from './session.service';
import { TariffService } from './../tariff/tariff.service';

@Module({
    imports: [DbModule],
    controllers: [SessionController],
    providers: [
        DiscountService,
        SessionService,
        TariffService,
        CarRepository,
        CarService,
    ],
})
export class SessionModule {}
