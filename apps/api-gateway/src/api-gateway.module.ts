import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { MueblesModule } from './muebles/muebles.module';
import { UserAuthenticationModule } from './user-authentication/user-authentication.module';

@Module({
  imports: [MueblesModule, UserAuthenticationModule],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
