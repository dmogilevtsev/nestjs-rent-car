import { Test, TestingModule } from '@nestjs/testing';

import { ISession } from './../entities/session.interface';
import { CreateSessionDto } from './../dto/create-session.dto';
import { SessionService } from './../services/session.service';
import { SessionController } from './session.controller';

const sessionMock: ISession[] = [
    {
        id: 1,
        car_id: 1,
        cost: 1026,
        discount_id: 1,
        dt_from: new Date('2022-03-01'),
        dt_to: new Date('2022-02-04'),
        tariff_id: 1,
    },
];

const SessionServiceMock = {
    getAllSessions: jest.fn((): ISession[] => sessionMock),
    getOneSession: jest.fn((id: number): ISession => sessionMock[0]),
    createSession: jest.fn(
        (session: CreateSessionDto): ISession => sessionMock[0],
    ),
};

describe('SessionController', () => {
    let controller: SessionController;
    let service: SessionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SessionService],
            controllers: [SessionController],
        })
            .overrideProvider(SessionService)
            .useValue(SessionServiceMock)
            .compile();
        controller = module.get(SessionController);
        service = module.get(SessionService);
    });

    describe('getSessions', () => {
        it('should return an array of sessions', async () => {
            jest.spyOn(service, 'getAllSessions').mockImplementation(
                async () => sessionMock,
            );

            expect(await controller.getSessions()).toBe(sessionMock);
        });
    });

    describe('getSessionById', () => {
        it('should return an session', async () => {
            jest.spyOn(service, 'getOneSession').mockImplementation(
                async () => sessionMock[0],
            );

            expect(await controller.getSessionById(4)).toEqual(sessionMock[0]);
        });
    });

    describe('createSession', () => {
        it('should return an new session', async () => {
            jest.spyOn(service, 'createSession').mockImplementation(
                async () => sessionMock[0],
            );

            expect(
                await controller.createSession({
                    car_id: 1,
                    dt_from: new Date('2022-03-01'),
                    dt_to: new Date('2022-02-04'),
                    tariff_id: 1,
                }),
            ).toEqual(sessionMock[0]);
        });
    });
});
