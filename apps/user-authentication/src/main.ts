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

  /*const app = await NestFactory.create(UserAuthModule);

  // 1. Microservicio TCP
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
        options: {
          host: envs.usuariosMicroserviceHost,
          port: envs.usuariosMicroservicePort
        }
  });

  // 2. Microservicio Kafka
  app.connectMicroservice<MicroserviceOptions>({
    
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'notificaciones',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'notificaciones-consumer-group',
      },
    },
  });

  // Iniciar ambos microservicios
  await app.startAllMicroservices();
  await app.listen(3000); // si necesitas también un endpoint HTTP opcional

  logger.log('✅ Notificaciones microservice con TCP y Kafka activo');*/
}
bootstrap();
