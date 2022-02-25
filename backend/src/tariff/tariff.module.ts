import { Module } from '@nestjs/common';

import { TariffController } from './tariff.controller';
import { TariffService } from './tariff.service';
import { DbModule } from './../db/db.module';

@Module({
    imports: [DbModule],
    controllers: [TariffController],
    providers: [TariffService],
})
export class TariffModule {}
