import { ReportModule } from './report/report.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DiscountModule } from './discount/discount.module';
import { SessionModule } from './session/session.module';
import { TariffModule } from './tariff/tariff.module';
import { CarModule } from './car/car.module';

@Module({
    imports: [
        ReportModule,
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
        DiscountModule,
        SessionModule,
        TariffModule,
        CarModule,
    ],
    providers: [ConfigService],
})
export class AppModule {}
