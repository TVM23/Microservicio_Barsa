import { NestFactory, Reflector } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { envs, RpcCustomExceptionFilter } from '@app/contracts';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { AtGuard } from './user-authentication/common/guards';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const logger = new Logger('ApiGateway')

  // Habilitar CORS para permitir peticiones desde otras aplicaciones (por ejemplo, Android)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,POST,PUT,DELETE,OPTIONS,PATCH',
    allowedHeaders: 'Content-Type, Authorization',
  });
  
  //app.setGlobalPrefix('api');

  //Usado para validaciones en los dtos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors
          .map((err) => err.constraints ? Object.values(err.constraints).join(". ") : "Error desconocido")
          .filter(Boolean); // Filtra los valores vacíos
        return new BadRequestException(messages[0] || "Error de validación"); // Devuelve un mensaje válido
      },
    })
  );
  

  //const reflector = new Reflector()
  //app.useGlobalGuards(new AtGuard(reflector))

  app.useGlobalFilters(new RpcCustomExceptionFilter())

  await app.listen(envs.port);

  console.log(`API Gateway corriendo en: ${await app.getUrl()}`);
  logger.log(`ApiGateway running on port: ${envs.port}`)
}
bootstrap();
