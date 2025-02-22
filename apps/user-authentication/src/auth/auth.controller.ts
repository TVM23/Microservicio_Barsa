import { Controller, Post, UseGuards, Res, HttpCode, HttpStatus, Req, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/schema/user.schema';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { USER_PATTERNS } from '@app/contracts';
import { Tokens } from './types';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @MessagePattern(USER_PATTERNS.LOGIN_USUARIO)
    async login(@Payload() loginDto: LoginDto): Promise<Tokens> {
        return await this.authService.login(loginDto);
    }

    @MessagePattern(USER_PATTERNS.LOGOUT_USUARIO)
    async logout(@Payload()  data: { userId: string }) {
        if (!data.userId) {
            throw new UnauthorizedException('Usuario no autenticado');
        }
        return await this.authService.logout(data.userId);
    }
    
    @MessagePattern(USER_PATTERNS.REFRESH_TOKEN)
    async refreshToken(@Payload() data: { userId: string, rt: string }){
        return await this.authService.refreshToken(data.userId, data.rt)
    }


}
