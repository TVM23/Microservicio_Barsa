import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { MueblesModule } from './muebles/muebles.module';
import { UserAuthenticationModule } from './user-authentication/user-authentication.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './user-authentication/common/guards';
import { ProductoModule } from './producto/producto.module';
import { PapeletaModule } from './papeleta/papeleta.module';
import { MateriaModule } from './materia/materia.module';

@Module({
  imports: [MueblesModule, UserAuthenticationModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ProductoModule,
    PapeletaModule,
    MateriaModule,
  ],
  controllers: [ApiGatewayController],
  providers: [ 
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    ApiGatewayService,
  ],
})
export class ApiGatewayModule {}
