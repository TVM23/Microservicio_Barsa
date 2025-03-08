import { NestFactory } from '@nestjs/core';
import { MateriaModule } from './materia.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from '@app/contracts';

async function bootstrap() {
  
  const logger = new Logger('MateriaService')
    
      const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        MateriaModule,
        {
          transport: Transport.TCP,
          options: {
            host: envs.materiaMicroserviceHost,
            port: envs.materiaMicroservicePort
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
    
      logger.log(`Materia Microservice running on port: ${envs.materiaMicroservicePort}`)
}
bootstrap();
