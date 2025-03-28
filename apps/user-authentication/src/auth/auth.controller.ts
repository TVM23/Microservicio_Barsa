import { Controller } from '@nestjs/common';
import { USER_PATTERNS, ChangePasswordDto, LoginDto } from '@app/contracts';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Tokens } from './types';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @MessagePattern(USER_PATTERNS.LOGIN_USUARIO)
    async login(@Payload() loginDto: LoginDto): Promise<Tokens> {
        return await this.authService.login(loginDto);
    }

    @MessagePattern(USER_PATTERNS.LOGOUT_USUARIO)
    async logout(@Payload()  data: { userId: string }) {
        return await this.authService.logout(data.userId);
    }
    
    @MessagePattern(USER_PATTERNS.REFRESH_TOKEN)
    async refreshToken(@Payload() data: { userId: string, rt: string }){
        return await this.authService.refreshToken(data.userId, data.rt)
    }


    @MessagePattern(USER_PATTERNS.GET_INFO_USUARIO)
    async getInfoUser(@Payload() data: { userId: string }){
        return await this.authService.getInfoUser(data.userId)
    }

    @MessagePattern(USER_PATTERNS.CHANGE_PASSWORD)
    async changePassword(@Payload() data: { dtoChangePassword: ChangePasswordDto, userId: string }) {
        return await this.authService.changePassword(data.dtoChangePassword, data.userId);
    }

    //PENDIENTE POR EL MOMENTO ------- Cambiar contraseña pero se olvido de la antigua
    @MessagePattern(USER_PATTERNS.FORGOT_PASSWORD)
    async forgotPassword(@Payload() dtoForgotPassword: ForgotPasswordDto) {
        return await this.authService.forgotPassword(dtoForgotPassword);
    }

}
