import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserRequest } from './dto/create-user.request';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {

    constructor (@InjectModel(User.name) private readonly userModel: Model<User> ) {}

    async createUser(data: CreateUserRequest) {
    try {
        await new this.userModel({
            ...data,
            password: await hash(data.password, 10),
        }).save();
        return { message: `Usuario creado correctamente` };
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        throw new Error('No se pudo crear el usuario');
    }
}

}
