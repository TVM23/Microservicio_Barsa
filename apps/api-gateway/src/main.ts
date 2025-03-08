import { NestFactory, Reflector } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { envs, RpcCustomExceptionFilter } from '@app/contracts';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AtGuard } from './user-authentication/common/guards';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const logger = new Logger('ApiGateway')

  // Habilitar CORS para permitir peticiones desde otras aplicaciones (por ejemplo, Android)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,POST,PUT,DELETE,OPTIONS,PATCH',
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
  logger.log(`ApiGateway running on port: ${envs.port}`)


  /*const rabbitmqMicroservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@rabbitmq:5672'], // Usar el nombre del servicio de RabbitMQ en Docker
      queue: 'materia_queue', // Nombre de la cola
      queueOptions: {
        durable: false, // Cola no durable (se pierde si RabbitMQ se reinicia)
      },
    },
  });


  // Iniciar los microservicios
  await app.startAllMicroservices();
  logger.log('Microservice RabbitMQ are running')*/

}
bootstrap();
