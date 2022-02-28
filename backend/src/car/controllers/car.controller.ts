import { Controller, Get, Param, Query } from '@nestjs/common';

import { CreateSessionDto } from './../dto/create-session.dto';
import { CarService } from './../services/car.service';
import { ICar } from './../entities/car.interface';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Car Controller')
@Controller('car')
export class CarController {
    constructor(private readonly carService: CarService) {}
    @ApiResponse({
        description: 'Get all cars',
        status: 200,
    })
    @Get()
    async getAllCars(): Promise<ICar[]> {
        return await this.carService.getAllCars();
    }

    @ApiResponse({
        status: 200,
        description: 'Get rental price',
    })
    @Get('rent-price')
    async rentPrice(
        @Query()
        createSessionDto: CreateSessionDto,
    ): Promise<number> {
        return await this.carService.rentPrice(createSessionDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get one car by id',
    })
    @Get(':id')
    async getOneCar(@Param('id') id: number): Promise<ICar> {
        return await this.carService.getOneCar(id);
    }
}
