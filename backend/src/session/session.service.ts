import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { differenceInDays, isWeekend } from 'date-fns';

import { ISession } from './session.interface';
import { DatabaseService } from './../db/database.service';
import { CreateSessionDto } from './../car/dto/create-session.dto';
import { DiscountService } from './../discount/discount.service';
import { CarService } from './../car/services/car.service';
import { TariffService } from './../tariff/tariff.service';

@Injectable()
export class SessionService {
    private readonly log: Logger = new Logger(SessionService.name);
    constructor(
        private readonly db: DatabaseService,
        private readonly tariffService: TariffService,
        private readonly carService: CarService,
        private readonly discountService: DiscountService,
    ) {}

    async createSession({
        dt_from,
        dt_to,
        car_id,
        tariff_id,
    }: CreateSessionDto): Promise<ISession> {
        const dtFrom = new Date(dt_from);
        const dtTo = new Date(dt_to);
        if (dtFrom > dtTo) {
            throw new HttpException(
                'Date from can not be more then date to!',
                HttpStatus.BAD_REQUEST,
            );
        }
        if (await this.carService.carIsAvailable(car_id, dtFrom)) {
            if (isWeekend(dtFrom) || isWeekend(dtTo)) {
                throw new HttpException(
                    `You can't rent a car on weekends`,
                    HttpStatus.BAD_REQUEST,
                );
            }
            try {
                if (!(await this.carService.getOneCar(car_id))) {
                    throw new HttpException(
                        'Car with this id is absent in our database.',
                        HttpStatus.BAD_REQUEST,
                    );
                }
                const tariff = await this.tariffService.getOneTariff(tariff_id);
                if (!tariff) {
                    throw new HttpException(
                        'Tariff with this id is absent in our database.',
                        HttpStatus.BAD_REQUEST,
                    );
                }
                const countDays: number = differenceInDays(dtTo, dtFrom) + 1;
                const discount =
                    countDays > 2
                        ? await this.discountService.getOneDiscount(countDays)
                        : null;
                const cost = this.carService.calculateRentPrice(
                    countDays,
                    tariff.price,
                    discount?.percent,
                );
                const sqlQuery = /* sql */ `
                    insert into session(dt_from, dt_to, car_id, discount_id, tariff_id, cost) 
                    values ($1, $2, $3, $4, $5, $6)
                    RETURNING id, dt_from, dt_to, car_id, discount_id, tariff_id, cost;
                `;
                const result = await this.db.executeQuery<ISession>(sqlQuery, [
                    dtFrom,
                    dtTo,
                    car_id,
                    discount?.id,
                    tariff_id,
                    cost,
                ]);
                return result[0];
            } catch (error) {
                this.log.warn('[createSession (insert into session)]', error);
            }
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
