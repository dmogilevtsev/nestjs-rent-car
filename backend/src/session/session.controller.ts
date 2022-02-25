import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { ISession } from './session.interface';
import { SessionService } from './session.service';
import { CreateSessionDto } from '../car/dto/create-session.dto';

@Controller('session')
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}
    @Post()
    async createSession(
        @Body() createSessionDto: CreateSessionDto,
    ): Promise<any> {
        await this.sessionService.createSession(createSessionDto);
    }

    @Get(':id')
    async getSessionById(@Param('id') id: number): Promise<ISession> {
        return await this.sessionService.getSession(id);
    }

    @Get()
    async getSessions(): Promise<ISession[]> {
        return await this.sessionService.getSessions();
    }
}
