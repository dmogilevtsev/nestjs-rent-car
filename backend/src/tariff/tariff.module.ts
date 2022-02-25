import { Module } from '@nestjs/common';

import { TariffService } from './tariff.service';
import { DbModule } from './../db/db.module';

@Module({
    imports: [DbModule],
    controllers: [],
    providers: [TariffService],
})
export class TariffModule {}
