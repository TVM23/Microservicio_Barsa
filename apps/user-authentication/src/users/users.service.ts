import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { FilterQuery, Model } from 'mongoose';
import { CreateUserRequest } from './dto/create-user.request';
import { hash } from 'bcryptjs';
import { query } from 'express';
import { NotFoundError } from 'rxjs';
import { use } from 'passport';
import * as bcrypt from 'bcryptjs';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {

    constructor (@InjectModel(User.name) private readonly userModel: Model<User> ) {}

    async createUser(data: CreateUserRequest) {
        const emailInUse = await this.userModel.findOne({
            email: data.email,
        }) 
        if (emailInUse){
            throw new RpcException({
                message: 'Este correo ya esta registrado',
                error: 'BadRequestException',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }
        await new this.userModel({
            ...data,
            password: await hash(data.password, 10),
        }).save();
        return { message: `Usuario creado correctamente` };
    }

    async getUser(query: FilterQuery<User>) {
        const user = (await this.userModel.findOne(query))?.toObject();
        if (!user){
            throw new NotFoundException('Usuario no existe');
        }
        return user;
    }

    async getUserByEmail(email: string){
        const user = await this.userModel.findOne({ email });
        return user;
    }

    async updateRtHash(userId: string, rt: string){
        const hash = await bcrypt.hash(rt, 10)
        await this.userModel.updateOne(
            { _id: userId },
            { $set: { hashRefreshToken: hash } }
        );
    }

}
