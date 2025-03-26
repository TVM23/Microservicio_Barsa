import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserRequest, GetUsersFiltersDto, UpdateUserDto, UpdatePersonalInfoDto } from '@app/contracts';
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
        const userNameInUse = await this.userModel.findOne({
            nombreUsuario: data.nombreUsuario,
        }) 
        //Checa si el email no esta registrada ya
        if (userNameInUse){
            throw new RpcException({
                message: 'Este nombre de usuario ya esta registrado',
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
        if (dtoGetUsers.nombreUsuario) query.nombreUsuario = new RegExp(dtoGetUsers.nombreUsuario, 'i'); // Búsqueda insensible a mayúsculas/minúsculas
        if (dtoGetUsers.email) query.email = dtoGetUsers.email;
        if (dtoGetUsers.rol) query.rol = dtoGetUsers.rol;
        if (dtoGetUsers.estado == "true" || dtoGetUsers.estado == "false"){
            query.estado = dtoGetUsers.estado;
        }
        
        return this.userModel.find(query)
            .select('nombre apellidos nombreUsuario email rol estado').exec();
    }

    async updateUserPersonal(userId: string, dtoUpdateUserPersonal: UpdatePersonalInfoDto) {
        try {
          const user = await this.userModel.findById(userId).exec();
          const { _id: _, ...data } = dtoUpdateUserPersonal; // Excluir _id del DTO

          const newUserName = data.nombreUsuario
          const newUserEmail = data.email

          if (!user) {
            throw new RpcException(`Usuario con id ${userId} no encontrado.`);
          }

          if(user.nombreUsuario != newUserName){
            const userNameCheck = await this.userModel.findOne({
                nombreUsuario: newUserName,
            }).exec();
            if (userNameCheck) {
                throw new RpcException(`Ya existe otra cuenta que tiene el nombre de usuario ${newUserName}.`);
            }
          }

          if(user.email != newUserEmail && newUserEmail != null ){
            const userEmailCheck = await this.userModel.findOne({
                email: newUserEmail,
            }).exec();
            if (userEmailCheck) {
                throw new RpcException(`Ya existe otra cuenta registrada con el email ${newUserEmail}.`);
            }
          }

          Object.assign(user, data); // Copiar los campos del DTO al usuario existente
      
          await user.save(); // Guardar los cambios
          const userActualizado = await this.userModel.findById(userId)
                .select('nombre apellidos nombreUsuario email rol estado');
          return userActualizado
        } catch (error) {
          console.error("Error en UserService:", error); // Log del error
          throw error;
        }
    }

    async updateUser(_id: string, dtoUpdateUser: UpdateUserDto) {
        try {
          const user = await this.userModel.findById(_id).exec();
          const { _id: _, ...data } = dtoUpdateUser; // Excluir _id del DTO
          const newUserName = data.nombreUsuario
          const newUserEmail = data.email
          if (!user) {
            throw new RpcException(`Usuario con id ${_id} no encontrado.`);
          }
          if(user.nombreUsuario != newUserName){
            const userNameCheck = await this.userModel.findOne({
                nombreUsuario: newUserName,
            }).exec();
            if (userNameCheck) {
                throw new RpcException(`Ya existe otra cuenta que tiene el nombre de usuario ${newUserName}.`);
            }
          }

          if(user.email != newUserEmail && newUserEmail != null ){
            const userEmailCheck = await this.userModel.findOne({
                email: newUserEmail,
            }).exec();
            if (userEmailCheck) {
                throw new RpcException(`Ya existe otra cuenta registrada con el email ${newUserEmail}.`);
            }
          }
      
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
                .select('nombre apellidos nombreUsuario email rol estado');
          return userActualizado
        } catch (error) {
          console.error("Error en UserService:", error); // Log del error
          throw error;
        }
    }

    //Desactivar cuenta
    async deactivateUser(userId: string){
        try {
            const user = await this.userModel.findById(userId).exec();
            if (!user) {
              throw new NotFoundException(`Usuario con id ${userId} no encontrado.`);
            }
          
            if(user.estado == true){
                user.estado = false
            }else if(user.estado == false){
                user.estado = true
            }
        
            await user.save(); // Guardar los cambios
            const userActualizado = await this.userModel.findById(userId)
                  .select('nombre apellidos nombreUsuario email rol estado');
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
        return user;
    }

    //Buscar usuario por nombre de Usuario
    async getUserByUserName(nombreUsuario: string){
        const user = await this.userModel.findOne({ nombreUsuario });
        if (!user) {
            throw new RpcException({
              message: `Usuario con email ${nombreUsuario} no encontrado.`,
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
        return user;
    }

    //Buscar usuario por id y obtener solo ciertos datos
    async getUserByIdInfo(userId: string){
        const user = await this.userModel.findOne({ _id: userId })
            .select('nombre apellidos nombreUsuario email rol estado');
        if (!user) {
            throw new RpcException({
              message: `Usuario con id ${userId} no encontrado.`,
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
