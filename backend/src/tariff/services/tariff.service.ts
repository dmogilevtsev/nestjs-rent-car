import { Injectable } from '@nestjs/common';

import { TariffRepository } from './../tariff.repository';
import { ITariff } from '../entities/tarif.interface';

@Injectable()
export class TariffService {
    constructor(private readonly repo: TariffRepository) {}

    async getOneTariff(id: number): Promise<ITariff> {
        return await this.repo.getOneTariff(id);
    }

    async getAllTariffs(): Promise<ITariff[]> {
        return await this.repo.getAllTariffs();
    }
}
