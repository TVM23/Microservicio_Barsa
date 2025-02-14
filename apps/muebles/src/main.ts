import { NestFactory } from '@nestjs/core';
import { MueblesModule } from './muebles.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { envs } from '@app/contracts';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger('MuebleService')

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MueblesModule,
    {
      transport: Transport.TCP,
      options: {
        host: envs.mueblesMicroserviceHost,
        port: envs.mueblesMicroservicePort
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

  logger.log(`Muebles Microservice running on port: ${envs.mueblesMicroservicePort}`)
}
bootstrap();

