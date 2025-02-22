import { Body, Controller, HttpCode, HttpStatus, Post, Req, Request, UseGuards } from '@nestjs/common';
import { UserAuthenticationService } from './user-authentication.service';
import { CreateUserRequest } from './dto/create-user.request';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { AtGuard, RtGuard } from './common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from './common/decorators';

@Controller('user-authentication')
export class UserAuthenticationController {

    constructor (private userAuthService: UserAuthenticationService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() dtoCreateUser: CreateUserRequest ){
        return await this.userAuthService.createUser(dtoCreateUser);
    }

    @Post('login')
    @Public() //Esto hace que se pueda realizar esta acción sin quese este autenticado
    @HttpCode(HttpStatus.OK)
    async login(@Body() dtoLogin: LoginDto){
        return await this.userAuthService.login(dtoLogin)
    }

    @Post('logout')
    @UseGuards(AtGuard)
    @HttpCode(HttpStatus.OK)
    async logout(@GetCurrentUserId() userId: string ) {
        return await this.userAuthService.logout(userId)
    }

    @Post('refresh')
    @UseGuards(RtGuard) // Recibe el mismo nombre que le pusimos al rt.strategy
    @HttpCode(HttpStatus.OK)
    async refreshToken(
        @GetCurrentUserId() userId: string,
        @GetCurrentUser('refreshToken') refreshToken: string,
    ){
        return await this.userAuthService.refreshToken(userId, refreshToken)
    }

    /* @Post('refresh')
    @UseGuards(RtGuard) // Recibe el mismo nombre que le pusimos al rt.strategy
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Req() req: Request){
        return await this.userAuthService.refreshToken(req)
    } */
}
