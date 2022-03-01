import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { SessionController } from '../src//session/controllers/session.controller';
import { CreateSessionDto } from './../src/session/dto/create-session.dto';
import { ISession } from './../src/session/entities/session.interface';
import { Session } from './../src/session/entities/session.entity';
import { AppModule } from '../src/app.module';

describe('[E2E Tests] SessionController', () => {
    let app: NestApplication;
    let controller: SessionController;
    let session: ISession;
    let createSession: CreateSessionDto;
    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        controller = moduleRef.get(SessionController);
        createSession = {
            car_id: 2,
            dt_from: new Date('2022-05-16'),
            dt_to: new Date('2022-05-25'),
            tariff_id: 1,
        };
        session = await controller.createSession(createSession);
    });

    describe('createSession', () => {
        it('should be not null', () => {
            expect(session).not.toBeNull();
        });
        it('should be equal at Session', () => {
            expect(session).toMatchObject(new Session());
        });
        it('cost should be equal 2 430$ (10 days * 270$ - 10%)', () => {
            expect(Number(session?.cost)).toEqual(2430);
        });
    });

    describe('getSessionById', () => {
        let _session: ISession;
        beforeEach(async () => {
            _session = await controller.getSessionById(session.id);
        });
        it('finded session to be equal created session', () => {
            expect(_session).toEqual(session);
        });
    });

    describe('getSessions', () => {
        let sessions: ISession[];
        beforeEach(async () => {
            sessions = await controller.getSessions();
        });
        it('should be Session', () => {
            expect(sessions[0]).toMatchObject<ISession>(new Session());
        });
        it('length of array sessions must be more than 1', () => {
            expect(sessions.length).toBeGreaterThan(1);
        });
    });

    afterAll(async () => {
        await controller.deleteSession(session.id);
        await app.close();
    });
});
