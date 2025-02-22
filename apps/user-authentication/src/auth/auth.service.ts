import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    async login(loginDto: LoginDto): Promise<Tokens> {      
      const user = await this.usersService.getUserByEmail(loginDto.email);
      if (!user) {
        throw new RpcException({
          message: `Usuario con correo ${loginDto.email} no encontrado.`,
          error: 'Unauthorized',
          status: 403
        });
      }
  
      const passwordMatches = await bcrypt.compare(loginDto.password, user.password);
      if (!passwordMatches) {
        throw new RpcException({
          message: 'Contraseña incorrecta. Por favor revisa tus credenciales.',
          error: 'Unauthorized',
          status: 403
        });
      }
  
      const tokens = await this.getTokens(user._id.toString(), user.email);
      await this.usersService.updateRtHash(user._id.toHexString(), tokens.refresh_token);
          
      return tokens;
    }
  

    async logout(userId: string){
      return await this.usersService.deleteRtUser(userId)
    }

    async refreshToken(userId: string, rt: string){
      const user = await this.usersService.getUserById(userId);
      if (!user) {
        throw new RpcException({
          message: `Usuario con id ${userId} no encontrado.`,
          error: 'Unauthorized',
          status: 403
        });
      }

      const rtMatches = await bcrypt.compare(rt, user.hashRefreshToken)
      if (!rtMatches) {
        throw new RpcException({
          message: `Los refresh tokens no coinciden`,
          error: 'AccessDenied',
          status: 403
        });
      }

      const tokens = await this.getTokens(user._id.toString(), user.email);
      await this.usersService.updateRtHash(user._id.toHexString(), tokens.refresh_token);
          
      return tokens;
      
    }

  async getTokens(userId: string, email: string): Promise<Tokens>{
    const [at, rt] = await Promise.all([

      this.jwtService.signAsync({
        sub: userId,
        email
      }, {
        secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: 60 * 15,
      }),

      this.jwtService.signAsync({
        sub: userId,
        email
      }, {
        secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: 60 * 60 * 24 * 7,
      })

    ]);

    return {
      access_token: at,
      refresh_token: rt,
    }
  }

}
