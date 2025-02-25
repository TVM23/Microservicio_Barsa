import { Inject, Injectable, InternalServerErrorException, Req, UnauthorizedException } from '@nestjs/common';
import { USERS_CLIENT } from './constant';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateUserRequest } from './dto/create-user.request';
import { lastValueFrom, tap } from 'rxjs';
import { USER_PATTERNS, UpdateUserDto } from '@app/contracts';
import { LoginDto } from './dto/login.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { use } from 'passport';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { GetUsersFiltersDto } from './dto/get-users-filter.dto';

@Injectable()
export class UserAuthenticationService {

    constructor (@Inject(USERS_CLIENT) private usersClient: ClientProxy){}

    createUser(dtoCreateUser: CreateUserRequest) {
        return this.usersClient.send(USER_PATTERNS.CREATE_USUARIO, dtoCreateUser).pipe(
            catchError( err => { throw new RpcException(err) } )
        );
    }

    login(dtoLogin: LoginDto) {
        return this.usersClient.send(USER_PATTERNS.LOGIN_USUARIO, dtoLogin).pipe(
            catchError( err => { throw new RpcException(err) } )
        );
        
    }

    logout(userId: string) {
        return this.usersClient.send(USER_PATTERNS.LOGOUT_USUARIO, { userId }).pipe(
            catchError(err => { throw new RpcException(err) })
        );
    }

    refreshToken(userId: string, rt: string) {
        return this.usersClient.send(USER_PATTERNS.REFRESH_TOKEN, { userId, rt }).pipe(
            catchError(err => { throw new RpcException(err) })
        );
    }

    getListadoUsuarios(dtoGetUsers: GetUsersFiltersDto){
        return this.usersClient.send(USER_PATTERNS.LISTADO_USUARIOS, dtoGetUsers).pipe(
            catchError(err => { throw new RpcException(err) })
        );
    }

    getInfoUser(userId: string){
        return this.usersClient.send(USER_PATTERNS.GET_INFO_USUARIO, { userId }).pipe(
            catchError(err => { throw new RpcException(err) })
        );
    }

    updateUser(dtoUpdateUser: UpdateUserDto){
        return this.usersClient.send(USER_PATTERNS.UPDATE_USUARIOS, dtoUpdateUser ).pipe(
            catchError(err => { throw new RpcException(err) })
        );
    }

    changePassword(dtoChangePassword: ChangePasswordDto, userId: string){
        return this.usersClient.send(USER_PATTERNS.CHANGE_PASSWORD, { dtoChangePassword, userId }).pipe(
            catchError(err => { throw new RpcException(err) })
        );
    }

    //PENDIENTE POR EL MOMENTO ------- Cambiar contraseña pero se olvido de la antigua
    forgotPassword(dtoForgotPassword: ForgotPasswordDto){
        return this.usersClient.send(USER_PATTERNS.FORGOT_PASSWORD, dtoForgotPassword ).pipe(
            catchError(err => { throw new RpcException(err) })
        );
    }
    
    /* logout(@Req() req: Request & { user?: any }) {
        //console.log("req.user:", req.user); 
        return this.usersClient.send(USER_PATTERNS.LOGOUT_USUARIO, { userId: req.user?.sub }).pipe(
            //tap(() => console.log("Enviando mensaje de logout con userId:", req.user?.sub)),
            catchError(err => { throw new RpcException(err) })
        );
    } 
        
    
    refreshToken(@Req() req: Request & { user?: any }) {
        return this.usersClient.send(USER_PATTERNS.REFRESH_TOKEN, { userId: req.user?.sub, rt: req.user?.refreshToken }).pipe(
            catchError(err => { throw new RpcException(err) })
        );
    }

    */
}
