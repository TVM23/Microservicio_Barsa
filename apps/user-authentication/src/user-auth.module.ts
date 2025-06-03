import { Module } from '@nestjs/common';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { envs, KafkaModule } from '@app/contracts';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NotificacionModule } from './notificacion/notificacion.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI
      }),
    }),
    UsersModule,
    AuthModule,
    NotificacionModule,
    //KafkaModule,
  ],
  controllers: [UserAuthController],
  providers: [UserAuthService],
})
export class UserAuthModule {}


/* @Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('MONGODB_URI'),
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [UserAuthController],
  providers: [UserAuthService],
})
export class UserAuthModule {} */