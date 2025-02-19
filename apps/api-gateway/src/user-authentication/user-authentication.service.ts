import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { USERS_CLIENT } from './constant';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateUserRequest } from './dto/create-user.request';
import { lastValueFrom } from 'rxjs';
import { USER_PATTERNS } from '@app/contracts';
import { LoginDto } from './dto/login.dto';
import { catchError, firstValueFrom } from 'rxjs';

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
    
}
