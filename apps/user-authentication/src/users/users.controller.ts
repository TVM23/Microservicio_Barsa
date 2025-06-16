import { Controller } from '@nestjs/common';
import { MessagePattern, Payload} from '@nestjs/microservices';
import { USER_PATTERNS, CreateUserRequest, GetUsersFiltersDto, UpdateUserDto, UpdatePersonalInfoDto } from '@app/contracts';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {

    constructor(private readonly userService: UsersService) {}


    @MessagePattern(USER_PATTERNS.CREATE_USUARIO)
    async createUser(@Payload() data: { dtoCreateUser: CreateUserRequest, rol: string } ){
        return await this.userService.createUser(data.dtoCreateUser, data.rol);
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
    async updateUser(@Payload() data: { dtoUpdateUser: UpdateUserDto, rol: string }){
        return await this.userService.updateUser(data.dtoUpdateUser._id, data.dtoUpdateUser, data.rol)
    }

    @MessagePattern(USER_PATTERNS.DEACTIVATE_USUARIO)
    async deactivateUser(@Payload() data: { userId: string, rol: string, idLogeado: string }){
        return await this.userService.deactivateUser(data.userId, data.rol, data.idLogeado)
    }
}
