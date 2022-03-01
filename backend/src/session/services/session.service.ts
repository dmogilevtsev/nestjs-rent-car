import { SessionRepository } from './../session.repository';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { differenceInDays, isValid, isWeekend } from 'date-fns';

import { DiscountService } from '../../discount/services/discount.service';
import { TariffService } from '../../tariff/services/tariff.service';
import { CreateSessionDto } from '../dto/create-session.dto';
import { CarService } from '../../car/services/car.service';
import { ISession } from '../entities/session.interface';

@Injectable()
export class SessionService {
    private readonly log: Logger = new Logger(SessionService.name);
    constructor(
        private readonly repo: SessionRepository,
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
        if (!isValid(new Date(dt_from)) || !isValid(new Date(dt_to))) {
            throw new HttpException('Incorrect date', HttpStatus.BAD_REQUEST);
        }
        const dtFrom = new Date(dt_from);
        const dtTo = new Date(dt_to);
        if (dtFrom > dtTo) {
            throw new HttpException(
                'Date from can not be more then date to!',
                HttpStatus.BAD_REQUEST,
            );
        }
        if (isWeekend(dtFrom) || isWeekend(dtTo)) {
            throw new HttpException(
                `You can't rent a car on weekends`,
                HttpStatus.BAD_REQUEST,
            );
        }

        const carIsAvailable =
            (await this.carService.carIsAvailable(car_id, dtFrom)) || false;

        if (carIsAvailable) {
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
                return await this.repo.createSession(
                    dtFrom,
                    dtTo,
                    car_id,
                    tariff_id,
                    cost,
                    discount?.id,
                );
            } catch (error) {
                this.log.warn(
                    '[createSession (insert into session)]' + error.message,
                );
            }
        }
    }

    async getOneSession(id: number): Promise<ISession> {
        return await this.repo.getSession(id);
    }

    async getAllSessions(): Promise<ISession[]> {
        return await this.repo.getSessions();
    }
}
