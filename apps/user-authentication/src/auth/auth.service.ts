import { ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/schema/user.schema';
import { TokenPayload } from './token-payload.interface';
import { Response } from 'express';
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

    /* async login(user: User):{
        const tokenExpirationMs = parseInt(
          this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_EXPIRATION_MS'),
        );
    
        const expiresAccessToken = new Date(Date.now() + tokenExpirationMs);
    
        const tokenPayload: TokenPayload = {
          userId: user._id.toHexString(),
        };
    
        const accessToken = this.jwtService.sign(tokenPayload, {
          secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: `${tokenExpirationMs}ms`,
        });
    
        return await {
          accessToken,
          expiresAt: expiresAccessToken,
        };
    } */

    /* async login(loginDto: LoginDto): Promise<Tokens>{
      const user = await this.usersService.getUserByEmail(loginDto.email)
      const passwordMatches = await bcrypt.compare(loginDto.password, user.password)
      if(!passwordMatches){
        throw new ForbiddenException('Contraseña incorrecta');
      }
      const tokens = await this.getTokens(user._id.toString(), user.email);
      await this.usersService.updateRtHash(user._id.toHexString(), tokens.refresh_token);
      return tokens;
    } */

    async login(loginDto: LoginDto): Promise<Tokens> {
          
          const user = await this.usersService.getUserByEmail(loginDto.email);
          if (!user) {
            throw new RpcException({
              message: `Usuario con correo ${loginDto.email} no encontrado.`,
              error: 'Unauthorized',
              statusCode: 403
            });
          }
  
  
          const passwordMatches = await bcrypt.compare(loginDto.password, user.password);
          if (!passwordMatches) {
            throw new RpcException({
              message: 'Contraseña incorrecta. Por favor revisa tus credenciales.',
              error: 'Unauthorized',
              statusCode: 403
            });
          }
  
          const tokens = await this.getTokens(user._id.toString(), user.email);
          await this.usersService.updateRtHash(user._id.toHexString(), tokens.refresh_token);
          
          return tokens;
    }
  

    async logout(){

    }

    async refreshToken(){
      
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



  async verifyUser(email: string, password: string){
    try{
          const user = await this.usersService.getUser({
              email,
          });
          const authenticated = await compare(password, user.password);
          if (!authenticated){
              throw new UnauthorizedException();
          }
          return user
      }catch(error){
          throw new UnauthorizedException('Las credenciales de usuario no son válidas');
      }
  }
      
}
