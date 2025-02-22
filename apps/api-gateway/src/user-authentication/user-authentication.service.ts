import { Inject, Injectable, InternalServerErrorException, Req, UnauthorizedException } from '@nestjs/common';
import { USERS_CLIENT } from './constant';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateUserRequest } from './dto/create-user.request';
import { lastValueFrom, tap } from 'rxjs';
import { USER_PATTERNS } from '@app/contracts';
import { LoginDto } from './dto/login.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { use } from 'passport';

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
