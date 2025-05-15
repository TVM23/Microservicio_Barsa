import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { UserAuthenticationModule } from './user-authentication/user-authentication.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './user-authentication/common/guards';
import { ProductoModule } from './producto/producto.module';
import { PapeletaModule } from './papeleta/papeleta.module';
import { MateriaModule } from './materia/materia.module';
import { ColoresModule } from './colores/colores.module';
import { ProductoXColorModule } from './producto_x_color/producto_x_color.module';
import { RolesGuard } from './user-authentication/common/guards/roles.guard';
import { InventarioModule } from './inventario/inventario.module';
import { ProduccionModule } from './produccion/produccion.module';

@Module({
  imports: [UserAuthenticationModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ProductoModule,
    PapeletaModule,
    MateriaModule,
    ColoresModule,
    ProductoXColorModule,
    InventarioModule,
    ProduccionModule,
  ],
  controllers: [ApiGatewayController],
  providers: [ 
    {
      provide: APP_GUARD,
      useClass: AtGuard,  //Esto checa que el usuario este autenticado
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,  //Esto checa que el usuario si es del rol que se pide
    },
    ApiGatewayService,
  ],
})
export class ApiGatewayModule {}
