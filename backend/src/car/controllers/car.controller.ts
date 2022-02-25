import { Controller, Get, Param, Query } from '@nestjs/common';

import { CreateSessionDto } from './../dto/create-session.dto';
import { CarService } from './../services/car.service';
import { ICar } from './../entities/car.interface';

@Controller('car')
export class CarController {
    constructor(private readonly carService: CarService) {}
    @Get()
    async getAllCars(): Promise<ICar[]> {
        return await this.carService.getAllCars();
    }

    @Get('rent-price')
    async rentPrice(
        @Query()
        createSessionDto: CreateSessionDto,
    ): Promise<number> {
        return await this.carService.rentPrice(createSessionDto);
    }

    @Get(':id')
    async getOneCar(@Param('id') id: number): Promise<ICar> {
        return await this.carService.getOneCar(id);
    }
}
