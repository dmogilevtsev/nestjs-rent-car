import { IBaseRepository } from './base.repository.interface';
import { Logger } from '@nestjs/common';
import { DatabaseService } from './database.service';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
    private readonly log: Logger;
    db: DatabaseService;
    constructor(
        private readonly table: string,
        private readonly dbService: DatabaseService,
        x?: () => T,
    ) {
        this.log = new Logger(x?.name);
        this.db = this.dbService;
    }

    async findAll(): Promise<T[]> {
        const query = /* sql */ `select * from ${this.table};`;
        try {
            return await this.db.executeQuery<T>(query);
        } catch (error) {
            this.log.warn(`Query was failed (${query})`, error);
        }
    }

    async findOne(id: number): Promise<T> {
        const query = /* sql */ `select * from ${this.table} where id = $1 limit 1;`;
        try {
            const result = await this.db.executeQuery<T>(query, [id]);
            return result[0];
        } catch (error) {
            this.log.warn('Query was failed', error);
        }
    }
}
