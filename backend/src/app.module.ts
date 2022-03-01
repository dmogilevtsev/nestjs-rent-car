import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DiscountModule } from './discount/discount.module';
import { ReportModule } from './report/report.module';
import { SessionModule } from './session/session.module';
import { TariffModule } from './tariff/tariff.module';
import { CarModule } from './car/car.module';
import { DbModule } from './db/db.module';

@Module({
    imports: [
        DbModule,
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
        ReportModule,
        DiscountModule,
        SessionModule,
        TariffModule,
        CarModule,
    ],
    providers: [ConfigService],
})
export class AppModule {}
