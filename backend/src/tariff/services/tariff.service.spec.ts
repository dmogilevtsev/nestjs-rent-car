import { Test, TestingModule } from '@nestjs/testing';

import { TariffRepository } from './../tariff.repository';
import { ITariff } from '../entities/tarif.interface';
import { TariffService } from './tariff.service';

const tariffsMock: ITariff[] = [{ id: 1, price: 270, kmperday: 200 }];

const TariffRepositoryMock = {
    getOneTariff: jest.fn((id: number): ITariff => tariffsMock[0]),
    getAllTariffs: jest.fn((): ITariff[] => tariffsMock),
};

describe('[CLASS] TariffService', () => {
    let tariffService: TariffService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TariffService, TariffRepository],
        })
            .overrideProvider(TariffRepository)
            .useValue(TariffRepositoryMock)
            .compile();
        tariffService = module.get(TariffService);
    });
    it('shoult be defined', () => {
        expect(tariffService).toBeDefined();
    });
    describe('[METHOD] getOneTariff', () => {
        it('should return id = 1', async () => {
            const res = await tariffService.getOneTariff(1);
            expect(res.id).toBe(1);
        });
        it('should be equal to ITariff from mock data', async () => {
            const res = await tariffService.getOneTariff(1);
            expect(res).toEqual(tariffsMock[0]);
        });
    });
    describe('[METHOD] getAllTariffs', () => {
        it('should return id = 1', async () => {
            const res = await tariffService.getAllTariffs();
            expect(res[0].id).toBe(1);
        });
        it('should be equal to ITariff from mock data', async () => {
            const res = await tariffService.getAllTariffs();
            expect(res[0]).toEqual(tariffsMock[0]);
        });
    });
});
