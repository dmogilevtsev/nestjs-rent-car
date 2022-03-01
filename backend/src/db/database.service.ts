import { Inject, Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
    private readonly logger = new Logger(DatabaseService.name);

    constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

    async executeQuery<T>(queryText: string, values: any[] = []): Promise<T[]> {
        this.logger.debug(`Executing query: ${queryText} (${values})`);
        const result = await this.pool.query<T>(queryText, values);
        this.logger.debug(`Executed query, result size ${result.rows.length}`);
        return result.rows;
    }
}
