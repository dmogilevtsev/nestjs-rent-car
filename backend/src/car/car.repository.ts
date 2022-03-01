import { isWeekend } from 'date-fns';
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';

import { DatabaseService } from './../db/database.service';
import { CreateCarDto } from './dto/create-car.dto';
import { ICar } from './entities/car.interface';
import { Car } from './entities/car.entity';

@Injectable()
export class CarRepository {
    private readonly logger = new Logger(CarRepository.name);
    constructor(private readonly db: DatabaseService) {}

    async carIsAvailable(car_id: number, dt_from: Date): Promise<boolean> {
        const getCarFromSession = /* sql */ `
        select * from session where car_id = $1 and $2 between dt_from and date(dt_to) + 3;            
    `;
        const sessions = await this.db.executeQuery(getCarFromSession, [
            car_id,
            dt_from,
        ]);
        if (isWeekend(dt_from)) {
            throw new HttpException(
                "Can't rent on weekends.",
                HttpStatus.BAD_REQUEST,
            );
        }
        if (sessions.length > 0) {
            throw new HttpException(
                'This car is in rent now.',
                HttpStatus.BAD_REQUEST,
            );
        }
        return true;
    }

    async create({ brand, model, gos, vin }: CreateCarDto): Promise<Car> {
        try {
            const newCar = await this.db.executeQuery<ICar>(
                /* sql */ `
            insert into cars(brand, model, gos, vin)
            values ($1, $2, $3, $4)
            RETURNING id, brand, model, gos, vin
        `,
                [brand, model, gos, vin],
            );
            return newCar[0];
        } catch (error) {
            this.logger.error(error.message);
        }
    }

    async findOne(id: number): Promise<Car> {
        try {
            const result = await this.db.executeQuery<ICar>(
                /* sql */ `select * from cars where id = $1 limit 1;`,
                [id],
            );
            return result[0];
        } catch (error) {
            this.logger.error(error.message);
        }
    }

    async findAll(): Promise<Car[]> {
        try {
            return await this.db.executeQuery<ICar>(
                /* sql */ `select * from cars;`,
            );
        } catch (error) {
            this.logger.error(error.message);
        }
    }
}
