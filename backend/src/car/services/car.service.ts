import { differenceInDays, isWeekend } from 'date-fns';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { DiscountService } from './../../discount/discount.service';
import { CreateSessionDto } from './../dto/create-session.dto';
import { TariffService } from './../../tariff/tariff.service';
import { CarRepository } from './../car.repository';
import { ICar } from './../entities/car.interface';

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
        car_id,
        dt_from,
        dt_to,
        tariff_id,
    }: CreateSessionDto): Promise<number | null> {
        if (
            (await this.carIsAvailable(car_id, dt_from)) &&
            this.periodLaseThenThirty(dt_from, dt_to) &&
            !this.cannotBeRentedOnWeekends(dt_from, dt_to)
        ) {
            const daysCount = differenceInDays(dt_from, dt_to);
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
        percent: number = null,
    ): number {
        const total = daysCount * price;
        return percent ? total - total * (percent / 100) : total;
    }

    periodLaseThenThirty(dt_from: Date, dt_to: Date): boolean {
        if (differenceInDays(dt_to, dt_from) > 30) {
            throw new HttpException(
                'Maximum rental period exceeded',
                HttpStatus.BAD_REQUEST,
            );
        }
        return true;
    }

    cannotBeRentedOnWeekends(dt_from: Date, dt_to: Date): boolean {
        return isWeekend(dt_from) || isWeekend(dt_to);
    }
}
