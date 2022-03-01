import { Injectable, Logger } from '@nestjs/common';

import { DatabaseService } from './../db/database.service';
import { ISession } from './entities/session.interface';

@Injectable()
export class SessionRepository {
    private readonly log: Logger = new Logger(SessionRepository.name);
    constructor(private readonly db: DatabaseService) {}

    async createSession(
        dtFrom: Date,
        dtTo: Date,
        car_id: number,
        tariff_id: number,
        cost: number,
        discount_id?: number,
    ): Promise<ISession> {
        try {
            const sqlQuery = /* sql */ `
                    insert into session(dt_from, dt_to, car_id, discount_id, tariff_id, cost) 
                    values ($1, $2, $3, $4, $5, $6)
                    RETURNING id, dt_from, dt_to, car_id, discount_id, tariff_id, cost;
                `;
            const result = await this.db.executeQuery<ISession>(sqlQuery, [
                dtFrom,
                dtTo,
                car_id,
                discount_id,
                tariff_id,
                cost,
            ]);
            return result[0];
        } catch (error) {
            this.log.error(error.message);
        }
    }

    async getSession(id: number): Promise<ISession> {
        try {
            const query = /* sql */ `select * from session where id=$1;`;
            const result = await this.db.executeQuery<ISession>(query, [id]);
            return result[0];
        } catch (error) {
            this.log.warn('[getSession]', error);
        }
    }

    async getSessions(): Promise<ISession[]> {
        try {
            const query = /* sql */ `select * from session;`;
            return await this.db.executeQuery<ISession>(query);
        } catch (error) {
            this.log.warn('[getSessions]', error);
        }
    }
}
