import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USER_PATTERNS } from '@app/contracts';

@Controller('users')
export class UsersController {

    constructor(private readonly userService: UsersService) {}

    /*@Post()
    async createUser(@Body() dtoCreateUser: CreateUserRequest ){
        await this.userService.createUser(dtoCreateUser);
    }*/

    @MessagePattern(USER_PATTERNS.CREATE_USUARIO)
    async createUser(@Payload() dtoCreateUser: CreateUserRequest ){
        return await this.userService.createUser(dtoCreateUser);
    }

}
