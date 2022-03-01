import { Injectable, Logger } from '@nestjs/common';

import { IAverageCarLoadByDayResponse } from './reposrt.interface';
import { DatabaseService } from './../db/database.service';

@Injectable()
export class ReportRepository {
    private readonly log = new Logger(ReportRepository.name);
    constructor(private readonly db: DatabaseService) {}

    async averageCarLoadByDay(
        dtFrom: string,
        dtTo: string,
        car_id?: number,
    ): Promise<IAverageCarLoadByDayResponse[]> {
        try {
            const queryValues: any = [dtFrom, dtTo];
            let whereCarIdQuery = '';
            if (car_id) {
                whereCarIdQuery = ' and a.id = $3 ';
                queryValues.push(car_id);
            }
            const query = /* sql */ `
            select b.dt_from, b.dt_to, a.brand || ' ' || a.model as car
            from cars as a
            left join session as b on b.car_id = a.id
            where (DATE(b.dt_from), DATE(b.dt_to)) OVERLAPS (DATE($1), DATE($2)) ${whereCarIdQuery}
        `;
            return await this.db.executeQuery<IAverageCarLoadByDayResponse>(
                query,
                queryValues,
            );
        } catch (error) {
            this.log.warn('[averageCarLoadByDay]', error);
        }
    }
}
