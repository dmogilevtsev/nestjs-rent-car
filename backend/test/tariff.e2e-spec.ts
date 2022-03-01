import { Tariff } from './../src/tariff/entities/tariff.entity';
import { ITariff } from './../src/tariff/entities/tarif.interface';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { TariffController } from './../src/tariff/controllers/tariff.controller';
import { AppModule } from '../src/app.module';

describe('[E2E Tests] TariffController', () => {
    let app: NestApplication;
    let controller: TariffController;
    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        controller = moduleRef.get(TariffController);
    });

    describe('getOneTariff', () => {
        let tariff: ITariff;
        describe('tarif by id = 1', () => {
            beforeAll(async () => {
                tariff = await controller.getOneTariff(1);
            });
            it('shuld be match object by Tariff', () => {
                expect(tariff).toMatchObject<ITariff>(new Tariff());
            });
            it('id shuld be 1', () => {
                expect(tariff?.id).toBe(1);
            });
            it('price shuld be 270', () => {
                expect(tariff?.price).toBe(270);
            });
            it('km shuld be 200', () => {
                expect(tariff?.kmperday).toBe(200);
            });
        });
        describe('tarif by id = 2', () => {
            beforeAll(async () => {
                tariff = await controller.getOneTariff(2);
            });
            it('shuld be match object by Tariff', () => {
                expect(tariff).toMatchObject<ITariff>(new Tariff());
            });
            it('id shuld be 2', () => {
                expect(tariff?.id).toBe(2);
            });
            it('price shuld be 330', () => {
                expect(tariff?.price).toBe(330);
            });
            it('km shuld be 350', () => {
                expect(tariff?.kmperday).toBe(350);
            });
        });
        describe('tarif by id = 3', () => {
            beforeAll(async () => {
                tariff = await controller.getOneTariff(3);
            });
            it('shuld be match object by Tariff', () => {
                expect(tariff).toMatchObject<ITariff>(new Tariff());
            });
            it('id shuld be 3', () => {
                expect(tariff?.id).toBe(3);
            });
            it('price shuld be 330', () => {
                expect(tariff?.price).toBe(390);
            });
            it('km shuld be 350', () => {
                expect(tariff?.kmperday).toBe(500);
            });
        });
    });

    describe('getAllTariffs', () => {
        let tariffs: ITariff[];
        beforeAll(async () => {
            tariffs = await controller.getAllTariffs();
        });
        it('shuld be match object by Tariff', () => {
            expect(tariffs[0]).toMatchObject<ITariff>(new Tariff());
        });
        it('length of array eqaul 3', () => {
            expect(tariffs.length).toBe(3);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
