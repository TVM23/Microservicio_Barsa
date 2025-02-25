import { NestFactory } from '@nestjs/core';
import { UserAuthModule } from './user-auth.module';
import { envs } from '@app/contracts';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger('UsuarioAuthService')

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserAuthModule,
      {
        transport: Transport.TCP,
        options: {
          host: envs.usuariosMicroserviceHost,
          port: envs.usuariosMicroservicePort
        }
      }
    );
  
    //Usado para validaciones en los dtos
    app.useGlobalPipes(
      new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      })
    );
  
    await app.listen();
  
    logger.log(`Usuarios Microservice running on port: ${envs.usuariosMicroservicePort}`)
}
bootstrap();
