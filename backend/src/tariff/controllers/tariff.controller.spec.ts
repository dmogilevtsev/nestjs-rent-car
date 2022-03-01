import { Test, TestingModule } from '@nestjs/testing';

import { TariffService } from '../services/tariff.service';
import { ITariff } from './../entities/tarif.interface';
import { TariffController } from './tariff.controller';

const tariffsMock: ITariff[] = [
    {
        id: 1,
        kmPerDay: 200,
        price: 270,
    },
];

const TariffServiceMock = {
    getAllTariffs: jest.fn((): ITariff[] => tariffsMock),
    getOneTariff: jest.fn((id: number): ITariff => tariffsMock[0]),
};

describe('TariffController', () => {
    let controller: TariffController;
    let service: TariffService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TariffService],
            controllers: [TariffController],
        })
            .overrideProvider(TariffService)
            .useValue(TariffServiceMock)
            .compile();
        controller = module.get(TariffController);
        service = module.get(TariffService);
    });

    describe('getSessions', () => {
        it('should return an array of tariffs', async () => {
            jest.spyOn(service, 'getAllTariffs').mockImplementation(
                async () => tariffsMock,
            );

            expect(await controller.getAllTariffs()).toBe(tariffsMock);
        });
    });

    describe('getSessionById', () => {
        it('should return an tariff', async () => {
            jest.spyOn(service, 'getOneTariff').mockImplementation(
                async () => tariffsMock[0],
            );

            expect(await controller.getOneTariff(4)).toEqual(tariffsMock[0]);
        });
    });
});
