import { Injectable, Logger } from '@nestjs/common';

import { DatabaseService } from './../db/database.service';
import { ITariff } from './tarif.interface';

@Injectable()
export class TariffService {
    private readonly log: Logger = new Logger(TariffService.name);
    constructor(private readonly db: DatabaseService) {}

    async getOneTariff(id: number): Promise<ITariff> {
        try {
            const getTariff = /* sql */ `select * from tariffs where id=$1;`;
            const result = await this.db.executeQuery<ITariff>(getTariff, [id]);
            return result[0];
        } catch (error) {
            this.log.warn('[getOneTariff]', error);
        }
    }

    async getAllTariffs(): Promise<ITariff[]> {
        try {
            const getTariff = /* sql */ `select * from tariffs;`;
            return await this.db.executeQuery<ITariff>(getTariff);
        } catch (error) {
            this.log.warn('[getAllTariffs]', error);
        }
    }
}
