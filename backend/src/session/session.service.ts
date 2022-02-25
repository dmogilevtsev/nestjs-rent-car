import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { ISession } from './session.interface';
import { DatabaseService } from './../db/database.service';
import { CreateSessionDto } from './../car/dto/create-session.dto';
import { DiscountService } from './../discount/discount.service';
import { CarService } from './../car/services/car.service';
import { TariffService } from './../tariff/tariff.service';
import { differenceInDays } from 'date-fns';

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
    }: CreateSessionDto): Promise<boolean> {
        if (await this.carService.carIsAvailable(car_id, dt_from)) {
            if (
                new Date(dt_from).getDay() === 0 ||
                new Date(dt_from).getDay() === 6 ||
                new Date(dt_to).getDay() === 0 ||
                new Date(dt_to).getDay() === 6
            ) {
                // Начало и конец аренды не может выпадать на выходной день (суббота, воскресенье)
                throw new HttpException(
                    `You can't book a car on weekends`,
                    HttpStatus.BAD_REQUEST,
                );
            }
            // Создаем сессию
            try {
                if (!(await this.carService.getOneCar(car_id))) {
                    throw new HttpException(
                        'Car exist',
                        HttpStatus.BAD_REQUEST,
                    );
                }
                if (!(await this.tariffService.getOneTariff(tariff_id))) {
                    throw new HttpException(
                        'Tariff exist',
                        HttpStatus.BAD_REQUEST,
                    );
                }
                const countDays: number = differenceInDays(dt_from, dt_to);
                const discount =
                    countDays > 2
                        ? await this.discountService.getOneDiscount(countDays)
                        : null;
                const insertQuery = /* sql */ `insert into session(dt_from, dt_to, car_id, discount_id, tariff_id) values ($1, $2, $3, $4, $5);`;
                await this.db.executeQuery<ISession>(insertQuery, [
                    dt_from,
                    dt_to,
                    car_id,
                    discount?.id,
                    tariff_id,
                ]);
                return true;
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
