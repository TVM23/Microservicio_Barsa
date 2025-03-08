import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserRequest, GetUsersFiltersDto, UpdateUserDto } from '@app/contracts';
import { hash } from 'bcryptjs';
import * as bcrypt from 'bcryptjs';
import { RpcException } from '@nestjs/microservices';
import { ResetToken } from './schema/reset-token.schema';

@Injectable()
export class UsersService {

    constructor (
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(ResetToken.name) private readonly resetTokenModel: Model<ResetToken>
     ) {}

    //Creación de usuario
    async createUser(data: CreateUserRequest) {
        const emailInUse = await this.userModel.findOne({
            email: data.email,
        }) 
        //Checa si el email no esta registrada ya
        if (emailInUse){
            throw new RpcException({
                message: 'Este correo ya esta registrado',
                error: 'BadRequestException',
                status: HttpStatus.BAD_REQUEST
            });
        }
        if (typeof data.password === 'object') {
            throw new RpcException({
                message: 'Password should be a string',
                error: 'BadRequestException',
                status: HttpStatus.BAD_REQUEST
            });
        }
        
        const hashedPassword = await bcrypt.hash(data.password.trim(), 10);

        await new this.userModel({
            ...data,
            password: hashedPassword,
        }).save();
        return { message: `Usuario creado correctamente` };
    }

    //Obtener listado de usuarios
    async getListadoUsuarios(dtoGetUsers: GetUsersFiltersDto){
        const query: any = {};
        
        if (dtoGetUsers.nombre) query.nombre = new RegExp(dtoGetUsers.nombre, 'i'); // Búsqueda insensible a mayúsculas/minúsculas
        if (dtoGetUsers.email) query.email = dtoGetUsers.email;
        if (dtoGetUsers.rol) query.rol = dtoGetUsers.rol;
        if (dtoGetUsers.estado == "true" || dtoGetUsers.estado == "false"){
            query.estado = dtoGetUsers.estado;
        }
        
        return this.userModel.find(query)
            .select('nombre apellidoPaterno apellidoMaterno email rol estado').exec();
    }

    async updateUser(_id: string, dtoUpdateUser: UpdateUserDto) {
        try {
          const user = await this.userModel.findById(_id).exec();
          if (!user) {
            throw new NotFoundException(`Usuario con id ${_id} no encontrado.`);
          }
      
          const { _id: _, ...data } = dtoUpdateUser; // Excluir _id del DTO

          if (data.estado !== "true" && data.estado !== "false") {
            data.estado = "true";
          }

          if (data.password) {
            data.password = await bcrypt.hash(data.password, 10); // Encriptar la contraseña
            await this.deleteRtUser(_id)
          }


          Object.assign(user, data); // Copiar los campos del DTO al usuario existente
      
          await user.save(); // Guardar los cambios
          const userActualizado = await this.userModel.findById(_id)
                .select('nombre apellidoPaterno apellidoMaterno email rol estado');
          return userActualizado
        } catch (error) {
          console.error("Error en UserService:", error); // Log del error
          throw error;
        }
    }

    //Cambiar contraseña
    async changePassword(userId: string, newPassword: string){
        const user = await this.getUserById(userId)
        user.password = newPassword
        await user.save()
        return { message: "Contraseña cambiada con éxito" }
    }

    //Buscar usuario por email
    async getUserByEmail(email: string){
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new RpcException({
              message: `Usuario con email ${email} no encontrado.`,
              error: 'Unauthorized',
              status: 403
            });
        }
        if (user.estado == false){
            throw new RpcException({
                message: `Este usuario ha sido desactivado`,
                error: 'Unauthorized',
                status: 403
            });
        }
        return user;
    }

    //Buscar usuario por id
    async getUserById(userId: string){
        const user = await this.userModel.findOne({ _id: userId });
        if (!user) {
            throw new RpcException({
              message: `Usuario con id ${userId} no encontrado.`,
              error: 'Unauthorized',
              status: 403
            });
        }
        if (user.estado == false){
            throw new RpcException({
                message: `Este usuario ha sido desactivado`,
                error: 'Unauthorized',
                status: 403
            });
        }
        return user;
    }

    //Buscar usuario por id y obtener solo ciertos datos
    async getUserByIdInfo(userId: string){
        const user = await this.userModel.findOne({ _id: userId })
            .select('nombre apellidoPaterno apellidoMaterno email rol estado');
        if (!user) {
            throw new RpcException({
              message: `Usuario con id ${userId} no encontrado.`,
              error: 'Unauthorized',
              status: 403
            });
        }
        if (user.estado == false){
            throw new RpcException({
                message: `Este usuario ha sido desactivado`,
                error: 'Unauthorized',
                status: 403
            });
        }
        return user;
    }

    //Actualizar el rt del usuario
    async updateRtHash(userId: string, rt: string){
        const hash = await bcrypt.hash(rt, 10)
        await this.userModel.updateOne(
            { _id: userId },
            { $set: { hashRefreshToken: hash } }
        );
    }

    //Eliminar el rt del usuario
    async deleteRtUser(userId: string) {
        try {
            // Verificar si el usuario existe
            const user = await this.getUserById(userId);
            if (!user) {
                throw new RpcException({
                    message: 'Usuario no encontrado',
                    error: 'Not Found',
                    status: HttpStatus.NOT_FOUND,
                });
            }
    
            // Intentar actualizar el hashRefreshToken a null
            const result = await this.userModel.updateOne(
                { _id: userId },
                { $set: { hashRefreshToken: null } }
            );
            return { message: "Cerrado de sesión exitoso" };
    
        } catch (error) {
            // Capturar errores de la base de datos
            if (error instanceof RpcException) {
                throw error;
            }
            throw new RpcException({
                message: 'Error al cerrar sesión',
                error: error.message || 'Internal Server Error',
                status: HttpStatus.INTERNAL_SERVER_ERROR,
            });
        }
    }

    async saveResetToken(resetToken: string, userId: string){
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1)
        await this.resetTokenModel.create({
            token: resetToken,
            userId: userId,
            expiryDate: expiryDate
        })
    }
    

}
