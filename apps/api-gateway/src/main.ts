import { NestFactory, Reflector } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { envs, RpcCustomExceptionFilter } from '@app/contracts';
import { ValidationPipe } from '@nestjs/common';
import { AtGuard } from './user-authentication/common/guards';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  // Habilitar CORS para permitir peticiones desde otras aplicaciones (por ejemplo, Android)
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
    allowedHeaders: 'Content-Type, Authorization',
  });
  app.setGlobalPrefix('api');

  //Usado para validaciones en los dtos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  //const reflector = new Reflector()
  //app.useGlobalGuards(new AtGuard(reflector))

  app.useGlobalFilters(new RpcCustomExceptionFilter())

  await app.listen(envs.port);
  console.log(`API Gateway corriendo en: ${await app.getUrl()}`);
}
bootstrap();
