import { Controller, Get, Param } from '@nestjs/common';
import { ITariff } from './tarif.interface';

import { TariffService } from './tariff.service';

@Controller('tariff')
export class TariffController {
    constructor(private readonly tariffService: TariffService) {}

    @Get(':id')
    async getOneTariff(@Param('id') id: number): Promise<ITariff> {
        return await this.tariffService.getOneTariff(id);
    }

    @Get()
    async getAllTariffs(): Promise<ITariff[]> {
        return await this.tariffService.getAllTariffs();
    }
}
