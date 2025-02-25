import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RpcException } from '@nestjs/microservices';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { nanoid } from 'nanoid';
import { GetUsersFiltersDto } from '@app/contracts';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    //Login
    async login(loginDto: LoginDto): Promise<Tokens> {      
      const user = await this.usersService.getUserByEmail(loginDto.email);
  
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
  
    //Logout
    async logout(userId: string){
      if (!userId) {
        throw new RpcException({
            message: 'Usuario no autenticado',
            error: 'Unauthorized',
            status: HttpStatus.UNAUTHORIZED,
        });
      }
      return await this.usersService.deleteRtUser(userId)
    }

    //Obtener info de usuario
    async getInfoUser(userId: string){
      if (!userId) {
        throw new RpcException({
            message: 'Usuario no autenticado',
            error: 'Unauthorized',
            status: HttpStatus.UNAUTHORIZED,
        });
      }
      return await this.usersService.getUserByIdInfo(userId)
    }

    //Cambiar contraseña
    async changePassword(dtoChangePassword: ChangePasswordDto, userId: string){
      //Buscar usuario
      const user = await this.usersService.getUserById(userId);

      //Coparar contraseñas viejas
      const oldPasswordMatches = await bcrypt.compare(dtoChangePassword.oldPassword, user.password);
      if (!oldPasswordMatches) {
        throw new RpcException({
          message: 'Contraseña incorrecta. Intenta nuevamente.',
          error: 'Unauthorized',
          status: 403
        });
      }

      //Encriptar contraseña nueva
      const newHashePassword = await bcrypt.hash(dtoChangePassword.newPassword, 10)
      return await this.usersService.changePassword(userId, newHashePassword)

    }

    //PENDIENTE POR EL MOMENTO ------- Cambiar contraseña pero se olvido de la antigua
    async forgotPassword(dtoForgotPassword: ForgotPasswordDto){
      const user = await this.usersService.getUserByEmail(dtoForgotPassword.email);

      if(user){
        const resetToken = nanoid(64)
        await this.usersService.saveResetToken(user._id.toString(), resetToken)
      }

      return { message: "Un mensaje ha sido enviado al correo para restablece su contraseña" }
    }

    //Refresh token
    async refreshToken(userId: string, rt: string){
      const user = await this.usersService.getUserById(userId);

      if (!user.hashRefreshToken) {
        throw new RpcException({
          message: `Usuario no esta logeado por lo tanto no puede actualizar su token.`,
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

    //Obtener los tokens
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
