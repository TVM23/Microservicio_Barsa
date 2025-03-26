import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, Req, Request, UseGuards } from '@nestjs/common';
import { UserAuthenticationService } from './user-authentication.service';
import { CreateUserRequest } from './dto/create-user.request';
import { LoginDto } from './dto/login.dto';
import { RtGuard } from './common/guards';
import { GetCurrentUser, GetCurrentUserId, Public, Roles } from './common/decorators';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { GetUsersFiltersDto } from './dto/get-users-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePersonalInfoDto } from './dto/update-personal-info.dto';
import { Role } from './enums/role.enum';

@Controller('user-authentication')
export class UserAuthenticationController {

    constructor (private userAuthService: UserAuthenticationService) {}

    //Iniciar sesion
    @Public() //Esto hace que se pueda realizar esta acción sin quese este autenticado
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dtoLogin: LoginDto){
        return await this.userAuthService.login(dtoLogin)
    }

    //Agregar usuario
    @Public()
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() dtoCreateUser: CreateUserRequest ){
        return await this.userAuthService.createUser(dtoCreateUser);
    }

    //Cerrar sesion
    //@UseGuards(AtGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@GetCurrentUserId() userId: string ) {
        return await this.userAuthService.logout(userId)
    }

    //Refrescar el token
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

    //Listado de usuarios
    @Get('listado-usuarios')
    @Roles(Role.ADMIN)   //Roles("Administrador")
    @HttpCode(HttpStatus.OK)
    async getListadoUsuarios(@Query() dtoGetUsers: GetUsersFiltersDto ){
        return await this.userAuthService.getListadoUsuarios(dtoGetUsers)
    }

    //Consultar tus propios datos de usuario logeado
    @Get('obtener-info-usuario-personal')
    @HttpCode(HttpStatus.OK)
    async getInfoUser(@GetCurrentUserId() userId: string,){
        return await this.userAuthService.getInfoUser(userId)
    }

    //Editar datos de usuario logeados
    @Patch('update-info-usuario-personal')
    async updateUserPersonal(
        @GetCurrentUserId() _id: string, 
        @Body() dtoUpdateUserPersonal: UpdatePersonalInfoDto
    ) {
        return await this.userAuthService.updateUserPersonal({_id, ...dtoUpdateUserPersonal});
    }

    //Consultar detalles de usuario seleccionado
    @Get('obtener-info-usuario')
    @HttpCode(HttpStatus.OK)
    async getInfoUserAdmin(@Query('userId') userId: string){
        return await this.userAuthService.getInfoUser(userId)
    }

    //Editar datos de usuario seleccionado
    @Patch(':_id')
    async updateUser(
        @Param('_id') _id: string, 
        @Body() dtoUpdateUser: UpdateUserDto
    ) {
        return await this.userAuthService.updateUser({_id, ...dtoUpdateUser});
    }

    //Desactivar usuario
    @Put('desactivar-usuario/:_id')
    @HttpCode(HttpStatus.OK)
    async deactivateUser(@Param('_id') _id: string){
        return await this.userAuthService.deactivateUser(_id)
    }

    //Cambiar contraseña
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
