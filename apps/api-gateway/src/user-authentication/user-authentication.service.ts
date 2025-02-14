import { Inject, Injectable } from '@nestjs/common';
import { USERS_CLIENT } from './constant';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserRequest } from './dto/create-user.request';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserAuthenticationService {

    constructor (@Inject(USERS_CLIENT) private usersClient: ClientProxy){}

    async createUser(dtoCreateUser: CreateUserRequest) {
        try {
            const result = await lastValueFrom(
                this.usersClient.send('CREAR_USUARIO', dtoCreateUser)
            );
            console.log('Respuesta recibida:', result);
            return result;
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            throw new Error('No se pudo crear el usuario');
        }
    }
    
}
