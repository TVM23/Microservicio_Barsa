import { NestFactory } from '@nestjs/core';
import { ProductoModule } from './producto.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from '@app/contracts';

async function bootstrap() {
  
  const logger = new Logger('ProductoService')
  
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      ProductoModule,
      {
        transport: Transport.TCP,
        options: {
          host: envs.productoMicroserviceHost,
          port: envs.productoMicroservicePort
        }
      }
    );
  
    //Usado para validaciones en los dtos
    app.useGlobalPipes(
      new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      })
    );
  
    await app.listen();
  
    logger.log(`Producto Microservice running on port: ${envs.productoMicroservicePort}`)
}
bootstrap();
