import { differenceInDays, isWeekend } from 'date-fns';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { DiscountService } from './../../discount/discount.service';
import { CreateSessionDto } from './../dto/create-session.dto';
import { TariffService } from './../../tariff/tariff.service';
import { CarRepository } from './../car.repository';
import { ICar } from './../entities/car.interface';
import { MAX_DAY } from './../../constants';

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
        const dtFrom = new Date(dt_from);
        const dtTo = new Date(dt_to);
        if (dtFrom > dtTo) {
            throw new HttpException(
                'Date from can not be more then date to!',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (
            (!isWeekend(dt_from) || !isWeekend(dt_to)) &&
            this.periodLessThenThirty(dtFrom, dtTo) &&
            (await this.carIsAvailable(car_id, dtFrom))
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
}
