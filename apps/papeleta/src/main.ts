import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PapeletaModule } from './papeleta.module';
import { envs } from '@app/contracts';

async function bootstrap() {
  
  const logger = new Logger('PapeletaService')
  
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      PapeletaModule,
      {
        transport: Transport.TCP,
        options: {
          host: envs.papeletaMicroserviceHost,
          port: envs.papeletaMicroservicePort
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
  
    logger.log(`Papeleta Microservice running on port: ${envs.papeletaMicroservicePort}`)
}
bootstrap();
