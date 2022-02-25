import { DbModule } from './../db/db.module';
import { Module } from '@nestjs/common';

import { SessionController } from './session.controller';
import { DiscountService } from './../discount/discount.service';
import { SessionService } from './session.service';
import { CarService } from './../car/services/car.service';
import { TariffService } from './../tariff/tariff.service';

@Module({
    imports: [DbModule],
    controllers: [SessionController],
    providers: [DiscountService, SessionService, TariffService, CarService],
})
export class SessionModule {}
