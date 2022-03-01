import { Global, Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { Pool } from 'pg';

import { DatabaseService } from './database.service';

const databasePoolFactory = async (config: ConfigService) => {
    return new Pool({
        host: config.get<string>('PG_HOST'),
        port: config.get<number>('PG_PORT') || 5432,
        user: config.get<string>('PG_USERNAME'),
        password: config.get<string>('PG_PASSWORD'),
        database: config.get<string>('PG_DATABASE'),
    });
};

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [
        {
            provide: 'DATABASE_POOL',
            inject: [ConfigService],
            useFactory: databasePoolFactory,
        },
        DatabaseService,
    ],
    exports: [DatabaseService],
})
export class DbModule implements OnApplicationShutdown {
    private readonly logger = new Logger(DbModule.name);

    constructor(private readonly moduleRef: ModuleRef) {}

    onApplicationShutdown(signal?: string): any {
        this.logger.log(`Shutting down on signal ${signal}`);
        const pool = this.moduleRef.get('DATABASE_POOL') as Pool;
        return pool.end();
    }
}
