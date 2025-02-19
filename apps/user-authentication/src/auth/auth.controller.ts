import { Controller, Post, UseGuards, Res, Body } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { User } from '../users/schema/user.schema';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { USER_PATTERNS } from '@app/contracts';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    /*@Post('login')
    @UseGuards(LocalAuthGuard)
    async login(
        @CurrentUser() user: User,
        @Res({ passthrough: true }) response: Response,
    ) {
        await this.authService.login(user)
    } 

    @MessagePattern(USER_PATTERNS.LOGIN_USUARIO)
    @UseGuards(LocalAuthGuard)
    async login(@Payload() loginDto: LoginDto) {
        const user = await this.authService.verifyUser(loginDto.email, loginDto.password);
        return await this.authService.login(user);
    } */

    @MessagePattern(USER_PATTERNS.LOGIN_USUARIO)
    async login(@Payload() loginDto: LoginDto): Promise<Tokens> {
        return await this.authService.login(loginDto);
    }



    /* @Post('logout')
    async logout(){
        return await this.authService.logout()
    }

    @Post('refresh')
    async refreshToken(){
        return await this.authService.refreshToken()
    }*/


}
