import { Controller, Get } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';

@Controller()
export class UserAuthController {
  constructor(private readonly usuariosService: UserAuthService) {}

  @Get()
  getHello(): string {
    return this.usuariosService.getHello();
  }
}
