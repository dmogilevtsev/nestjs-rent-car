import { Module } from '@nestjs/common';

import { TariffController } from './controllers/tariff.controller';
import { TariffService } from './services/tariff.service';
import { TariffRepository } from './tariff.repository';

@Module({
    controllers: [TariffController],
    providers: [TariffService, TariffRepository],
})
export class TariffModule {}
