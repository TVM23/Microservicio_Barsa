import { Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USER_PATTERNS } from '@app/contracts';
import { GetUsersFiltersDto } from './dto/get-users-filter.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly userService: UsersService) {}


    @MessagePattern(USER_PATTERNS.CREATE_USUARIO)
    async createUser(@Payload() dtoCreateUser: CreateUserRequest ){
        return await this.userService.createUser(dtoCreateUser);
    }

    @MessagePattern(USER_PATTERNS.LISTADO_USUARIOS)
    async getListadoUsuarios(@Payload() dtoGetUsers: GetUsersFiltersDto) {
        return await this.userService.getListadoUsuarios(dtoGetUsers);
    }

}
