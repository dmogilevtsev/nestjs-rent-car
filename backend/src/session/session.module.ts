import { TariffRepository } from './../tariff/tariff.repository';
import { Module } from '@nestjs/common';

import { DiscountService } from '../discount/services/discount.service';
import { DiscountRepository } from './../discount/discount.repository';
import { SessionController } from './controllers/session.controller';
import { TariffService } from '../tariff/services/tariff.service';
import { SessionService } from './services/session.service';
import { CarService } from './../car/services/car.service';
import { SessionRepository } from './session.repository';
import { CarRepository } from './../car/car.repository';

@Module({
    controllers: [SessionController],
    providers: [
        DiscountService,
        SessionService,
        TariffService,
        CarService,
        CarRepository,
        DiscountRepository,
        SessionRepository,
        TariffRepository,
    ],
})
export class SessionModule {}
