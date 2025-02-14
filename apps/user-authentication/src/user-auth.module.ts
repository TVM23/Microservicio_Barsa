import { Module } from '@nestjs/common';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from '@app/contracts';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: envs.mongodb_URI
      }),
    }),
    UsersModule
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