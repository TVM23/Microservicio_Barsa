import { Body, Controller, Post } from '@nestjs/common';
import { UserAuthenticationService } from './user-authentication.service';
import { CreateUserRequest } from './dto/create-user.request';

@Controller('user-authentication')
export class UserAuthenticationController {

    constructor (private userAuthService: UserAuthenticationService) {}

    @Post()
    async createUser(@Body() dtoCreateUser: CreateUserRequest ){
        return await this.userAuthService.createUser(dtoCreateUser);
    }

}
