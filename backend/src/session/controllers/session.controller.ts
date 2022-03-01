import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { ISession } from '../entities/session.interface';
import { SessionService } from '../services/session.service';
import { CreateSessionDto } from '../dto/create-session.dto';

@ApiTags('Session controller')
@Controller('session')
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}

    @ApiResponse({
        status: 201,
        description: 'Create rent session',
    })
    @Post()
    async createSession(
        @Body() createSessionDto: CreateSessionDto,
    ): Promise<ISession> {
        return await this.sessionService.createSession(createSessionDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Get one session',
    })
    @Get(':id')
    async getSessionById(@Param('id') id: number): Promise<ISession> {
        return await this.sessionService.getOneSession(id);
    }

    @ApiResponse({
        status: 200,
        description: 'Get all sessions',
    })
    @Get()
    async getSessions(): Promise<ISession[]> {
        return await this.sessionService.getAllSessions();
    }
}
