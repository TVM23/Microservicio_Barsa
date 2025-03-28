import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RpcException } from '@nestjs/microservices';
import { CreateUserRequest, GetUsersFiltersDto, UpdateUserDto, UpdatePersonalInfoDto } from '@app/contracts';
import { User } from './schema/user.schema';
import { ResetToken } from './schema/reset-token.schema';
import { use } from 'passport';

@Injectable()
export class UsersService {

    constructor (
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(ResetToken.name) private readonly resetTokenModel: Model<ResetToken>
     ) {}

    //Creación de usuario
    async createUser(data: CreateUserRequest) {
        let userEmail = ""
        if(data.email != null){
            userEmail = data.email.toLowerCase();
        }

        const emailInUse = await this.userModel.findOne({
            email: userEmail,
        }) 
        //Checa si el email no esta registrada ya
        if (emailInUse && emailInUse.email != "" && emailInUse.email != null){
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
            email: userEmail,
            password: hashedPassword,
        }).save();
        return { message: `Usuario creado correctamente` };
    }

    //Obtener listado de usuarios
    async getListadoUsuarios(dtoGetUsers: GetUsersFiltersDto){
        const query: any = {};
        
        if (dtoGetUsers.nombre) query.nombre = new RegExp(dtoGetUsers.nombre, 'i'); // Búsqueda insensible a mayúsculas/minúsculas
        if (dtoGetUsers.nombreUsuario) query.nombreUsuario = new RegExp(dtoGetUsers.nombreUsuario, 'i'); // Búsqueda insensible a mayúsculas/minúsculas
        if (dtoGetUsers.email) query.email = new RegExp(dtoGetUsers.email, 'i');
        if (dtoGetUsers.rol) query.rol = dtoGetUsers.rol;
        if (dtoGetUsers.estado == "true" || dtoGetUsers.estado == "false"){
            query.estado = dtoGetUsers.estado;
        }
        
        return this.userModel.find(query)
            .select('nombre apellidos nombreUsuario email rol estado').exec();
    }

    async updateUserPersonal(userId: string, dtoUpdateUserPersonal: UpdatePersonalInfoDto) {
          const user = await this.getUserById(userId);
          const { _id: _, ...data } = dtoUpdateUserPersonal; // Excluir _id del DTO

          const newUserName = data.nombreUsuario
          let newUserEmail = ""
          if(data.email != null){
            newUserEmail = data.email.toLowerCase();
          }
          data.email = newUserEmail

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

          if(user.nombreUsuario != newUserName){
            const userNameCheck = await this.userModel.findOne({
                nombreUsuario: newUserName,
            }).exec();
            if (userNameCheck) {
                throw new RpcException({
                    message: `Ya existe otra cuenta que tiene el nombre de usuario ${newUserName}.`,
                    error: 'BadRequestException',
                    status: HttpStatus.BAD_REQUEST
                });
            }
          }

          if(user.email != newUserEmail && newUserEmail != "" ){
            const userEmailCheck = await this.userModel.findOne({
                email: newUserEmail,
            }).exec();
            if (userEmailCheck ) {
                throw new RpcException({
                    message: `Ya existe otra cuenta registrada con el email ${newUserEmail}.`,
                    error: 'BadRequestException',
                    status: HttpStatus.BAD_REQUEST
                });
            }
          }

          Object.assign(user, data); // Copiar los campos del DTO al usuario existente
      
           const userActualizado = await this.userModel.findByIdAndUpdate(
                userId,
                { $set: data },
                { new: true, select: 'nombre apellidos nombreUsuario email rol estado' }
            );
          return userActualizado
    }

    async updateUser(_id: string, dtoUpdateUser: UpdateUserDto) {
          const user = await this.getUserById(_id);
          const { _id: _, ...data } = dtoUpdateUser; // Excluir _id del DTO
          const newUserName = data.nombreUsuario
          let newUserEmail = ""
          if(data.email != null){
            newUserEmail = data.email.toLowerCase();
          }
          data.email = newUserEmail

          if (!user) {
            throw new RpcException({
                message: `Usuario con id ${_id} no encontrado.`,
                error: 'Unauthorized',
                status: 403
            });
          }

          if(user.nombreUsuario != newUserName){
            const userNameCheck = await this.userModel.findOne({
                nombreUsuario: newUserName,
            }).exec();
            if (userNameCheck) {
                throw new RpcException({
                    message: `Ya existe otra cuenta que tiene el nombre de usuario ${newUserName}.`,
                    error: 'BadRequestException',
                    status: HttpStatus.BAD_REQUEST
                });
            }
          }

          if(user.email != newUserEmail && newUserEmail != "" ){
            const userEmailCheck = await this.userModel.findOne({
                email: newUserEmail,
            }).exec();
            if (userEmailCheck ) {
                throw new RpcException({
                    message: `Ya existe otra cuenta registrada con el email ${newUserEmail}.`,
                    error: 'BadRequestException',
                    status: HttpStatus.BAD_REQUEST
                });
            }
          }

          if (data.rol && data.rol !== user.rol) {
            await this.deleteRtUser(_id);
          }
      
          if (data.estado !== "true" && data.estado !== "false") {
            data.estado = "true";
          }else if(data.estado == "false"){
            await this.deleteRtUser(_id);
          }

          if (data.password) {
            data.password = await bcrypt.hash(data.password, 10); // Encriptar la contraseña
            await this.deleteRtUser(_id)
          }

          Object.assign(user, data); // Copiar los campos del DTO al usuario existente
      
          const userActualizado = await this.userModel.findByIdAndUpdate(
                _id,
                { $set: data },
                { new: true, select: 'nombre apellidos nombreUsuario email rol estado' }
            );
          return userActualizado
    }

    //Desactivar cuenta
    async deactivateUser(userId: string){
            const user = await this.getUserById(userId);
            if (!user) {
              throw new RpcException({
                message: `Usuario con id ${userId} no encontrado.`,
                error: 'NotFoundExceptio',
                status: HttpStatus.NOT_FOUND
                });
            }
          
            if(user.estado == true){
                user.estado = false
            }else if(user.estado == false){
                user.estado = true
            }
        
            await user.save(); // Guardar los cambios

                  const userActualizado = await this.userModel.findByIdAndUpdate(
                    userId,
                    { $set: user },
                    { new: true, select: 'nombre apellidos nombreUsuario email rol estado' }
                );

            await this.deleteRtUser(userId);
            return userActualizado
    }

    //Cambiar contraseña
    async changePassword(userId: string, newPassword: string){
        const user = await this.getUserById(userId)
        if (user.estado == false){
            throw new RpcException({
                message: `Este usuario ha sido desactivado`,
                error: 'Unauthorized',
                status: 403
            });
        }
        const newHashePassword = await bcrypt.hash(newPassword, 10)
        user.password = newHashePassword
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
              message: `Usuario con nombre de usuario ${nombreUsuario} no encontrado.`,
              error: 'Unauthorized',
              status: 403
            });
        }
        return user;
    }

    //Buscar usuario por id
    async getUserById(userId: string) {
        try {
          const user = await this.userModel.findOne({ _id: userId });
          if (!user) {
            throw new RpcException({
              message: `Usuario con id ${userId} no encontrado.`,
              error: 'Unauthorized',
              status: 403
            });
          }
          return user;
        } catch (error) {
          throw new RpcException({
            message: "Error al buscar el usuario en la base de datos",
            error: error.message,
            status: 500
          });
        }
      }
      

    //Buscar usuario por id y obtener solo ciertos datos
    async getUserByIdInfo(userId: string){
        try{
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
        }catch (error) {
            throw new RpcException({
              message: "Error al buscar el usuario en la base de datos",
              error: error.message,
              status: 500
            });
        }
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
