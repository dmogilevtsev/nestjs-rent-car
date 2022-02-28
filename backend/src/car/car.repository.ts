import { isWeekend } from 'date-fns';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { Car } from './entities/car.entity';
import { DatabaseService } from './../db/database.service';
import { BaseRepository } from './../db/base.repository.abstract';

@Injectable()
export class CarRepository extends BaseRepository<Car> {
    constructor(db: DatabaseService) {
        super('cars', db);
    }

    async carIsAvailable(car_id: number, dt_from: Date): Promise<boolean> {
        const getCarFromSession = /* sql */ `
        select count(*) from session where car_id = $1 and $2 between dt_from and date(dt_to) + 3;            
    `;
        const car = await this.db.executeQuery<{ count: number }>(
            getCarFromSession,
            [car_id, dt_from],
        );
        if (isWeekend(dt_from)) {
            throw new HttpException(
                "Can't rent on weekends.",
                HttpStatus.BAD_REQUEST,
            );
        }
        if (car[0].count > 0) {
            throw new HttpException(
                'This car is in rent now.',
                HttpStatus.BAD_REQUEST,
            );
        }
        return true;
    }
}
