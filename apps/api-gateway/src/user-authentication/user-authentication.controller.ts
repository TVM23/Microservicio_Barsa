import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query, Req, Request, UseGuards } from '@nestjs/common';
import { UserAuthenticationService } from './user-authentication.service';
import { CreateUserRequest } from './dto/create-user.request';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { AtGuard, RtGuard } from './common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from './common/decorators';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { GetUsersFiltersDto } from './dto/get-users-filter.dto';

@Controller('user-authentication')
export class UserAuthenticationController {

    constructor (private userAuthService: UserAuthenticationService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() dtoCreateUser: CreateUserRequest ){
        return await this.userAuthService.createUser(dtoCreateUser);
    }

    @Public() //Esto hace que se pueda realizar esta acción sin quese este autenticado
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dtoLogin: LoginDto){
        return await this.userAuthService.login(dtoLogin)
    }

    //@UseGuards(AtGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@GetCurrentUserId() userId: string ) {
        return await this.userAuthService.logout(userId)
    }

    @Public()
    @UseGuards(RtGuard) // Recibe el mismo nombre que le pusimos al rt.strategy
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshToken(
        @GetCurrentUserId() userId: string,
        @GetCurrentUser('refreshToken') refreshToken: string,
    ){
        return await this.userAuthService.refreshToken(userId, refreshToken)
    }
    
    @Get('listado-usuarios')
    @HttpCode(HttpStatus.OK)
    async getListadoUsuarios(@Query() dtoGetUsers: GetUsersFiltersDto ){
        return await this.userAuthService.getListadoUsuarios(dtoGetUsers)
    }

    @Get('obtener-info-usuario')
    @HttpCode(HttpStatus.OK)
    async getInfoUserAdmin(@Query() userId: string,){
        return await this.userAuthService.getInfoUser(userId)
    }

    @Get('obtener-info-usuario-personal')
    @HttpCode(HttpStatus.OK)
    async getInfoUser(@GetCurrentUserId() userId: string,){
        return await this.userAuthService.getInfoUser(userId)
    }

    @Put('cambiar-password')
    @HttpCode(HttpStatus.OK)
    async changePassword(@Body() dtoChangePassword: ChangePasswordDto, @GetCurrentUserId() userId: string){
        return await this.userAuthService.changePassword(dtoChangePassword, userId)
    }
    
    //PENDIENTE POR EL MOMENTO ------- Cambiar contraseña pero se olvido de la antigua
    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() dtoForgotPassword: ForgotPasswordDto){
        return await this.userAuthService.forgotPassword(dtoForgotPassword)
    }
}
