import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';

import { TariffService } from '../services/tariff.service';
import { ITariff } from '../entities/tarif.interface';

@ApiTags('Tariff controller')
@Controller('tariff')
export class TariffController {
    constructor(private readonly tariffService: TariffService) {}

    @ApiResponse({
        status: 200,
        description: 'Get one tariff',
    })
    @Get(':id')
    async getOneTariff(@Param('id') id: number): Promise<ITariff> {
        return await this.tariffService.getOneTariff(id);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all tariffs',
    })
    @Get()
    async getAllTariffs(): Promise<ITariff[]> {
        return await this.tariffService.getAllTariffs();
    }
}
