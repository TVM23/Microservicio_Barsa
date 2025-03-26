import { Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateUserRequest, USER_PATTERNS, UpdateUserDto, UpdatePersonalInfoDto } from '@app/contracts';
import { UsersService } from './users.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { GetUsersFiltersDto } from 'libs/contracts/users/get-users-filter.dto';

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

    @MessagePattern(USER_PATTERNS.UPDATE_USUARIOS_PERSONAL)
    async updateUserPersonal(@Payload() dtoUpdateUserPersonal: UpdatePersonalInfoDto){
        return await this.userService.updateUserPersonal(dtoUpdateUserPersonal._id, dtoUpdateUserPersonal);
    }

    @MessagePattern(USER_PATTERNS.UPDATE_USUARIOS)
    async updateUser(@Payload() dtoUpdateUser: UpdateUserDto){
        return await this.userService.updateUser(dtoUpdateUser._id, dtoUpdateUser)
    }

    @MessagePattern(USER_PATTERNS.DEACTIVATE_USUARIO)
    async deactivateUser(@Payload() userId: string){
        return await this.userService.deactivateUser(userId)
    }
}
