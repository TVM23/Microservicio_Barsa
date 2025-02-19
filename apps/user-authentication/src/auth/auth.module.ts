import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { AtStrategy, RtStrategy } from './strategies';

@Module({
  imports: [UsersModule, PassportModule, JwtModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, AtStrategy, RtStrategy]
})
export class AuthModule {}
