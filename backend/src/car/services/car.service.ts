import { CreateCarDto } from './../dto/create-car.dto';
import { differenceInDays, isValid, isWeekend } from 'date-fns';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { CreateSessionDto } from '../../session/dto/create-session.dto';
import { TariffService } from '../../tariff/services/tariff.service';
import { CarRepository } from './../car.repository';
import { ICar } from './../entities/car.interface';
import { MAX_DAY } from './../../constants';
import { DiscountService } from '../../discount/services/discount.service';

@Injectable()
export class CarService {
    constructor(
        private readonly repo: CarRepository,
        private readonly tariffService: TariffService,
        private readonly discountService: DiscountService,
    ) {}

    async getAllCars(): Promise<ICar[]> {
        return await this.repo.findAll();
    }

    async getOneCar(id: number): Promise<ICar> {
        return await this.repo.findOne(id);
    }

    async carIsAvailable(car_id: number, dt_from: Date): Promise<boolean> {
        return await this.repo.carIsAvailable(car_id, dt_from);
    }

    async rentPrice({
        dt_from,
        dt_to,
        tariff_id,
        car_id,
    }: CreateSessionDto): Promise<number | null> {
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

        if (
            (!isWeekend(dt_from) || !isWeekend(dt_to)) &&
            this.periodLessThenThirty(dtFrom, dtTo) &&
            (await this.repo.carIsAvailable(car_id, dt_from))
        ) {
            const daysCount = differenceInDays(dtTo, dtFrom) + 1;
            const tariff = await this.tariffService.getOneTariff(tariff_id);
            const discount = await this.discountService.getOneDiscount(
                daysCount,
            );
            return this.calculateRentPrice(
                daysCount,
                tariff.price,
                discount?.percent,
            );
        }
        return null;
    }

    calculateRentPrice(
        daysCount: number,
        price: number,
        percent: number | null = null,
    ): number {
        const total = daysCount * price;
        return percent ? total - total * (percent / 100) : total;
    }

    periodLessThenThirty(dt_from: Date, dt_to: Date): boolean {
        if (differenceInDays(dt_to, dt_from) + 1 > MAX_DAY) {
            throw new HttpException(
                'Maximum rental period exceeded',
                HttpStatus.BAD_REQUEST,
            );
        }
        return true;
    }

    async createCar(car: CreateCarDto): Promise<ICar> {
        return await this.repo.create(car);
    }
}
