import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RpcException } from '@nestjs/microservices';
import { CreateUserRequest, GetUsersFiltersDto, UpdateUserDto, UpdatePersonalInfoDto } from '@app/contracts';
import { User } from './schema/user.schema';
import { ResetToken } from './schema/reset-token.schema';

@Injectable()
export class UsersService {

    constructor (
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(ResetToken.name) private readonly resetTokenModel: Model<ResetToken>
     ) {}

    private throwRpcException(message: string, error: string, status: number): never {
        throw new RpcException({ message, error, status });
    }

    private async validateUsername(newUserName: string, currentUserName: string) {
        if(currentUserName != newUserName){
            const userNameCheck = await this.userModel.findOne({nombreUsuario: newUserName}).exec()
            if (userNameCheck){
                this.throwRpcException(`Este nombre de usuario ${newUserName} ya está registrado`, 
                    'BadRequestException', HttpStatus.BAD_REQUEST);
            }
        }
    }
    
    private async validateEmail(newUserEmail: string, currentEmail: string){
        if(currentEmail != newUserEmail && newUserEmail != "" ){
            const userEmailCheck = await this.userModel.findOne({email: newUserEmail}).exec() 
            if (userEmailCheck ) {
                this.throwRpcException(`Ya existe otra cuenta registrada con el email ${newUserEmail}.`, 
                    'BadRequestException', HttpStatus.BAD_REQUEST
                );
            }
        }
    }

    private checkCuentaEstado(estado: boolean){
        if (estado == false){
            this.throwRpcException(`Este usuario ha sido desactivado`, 'Unauthorized', 403);
        }
    }

    private async updateUserInDB(userId: string, newUserEmail: string, data: any) {
        return this.userModel.findByIdAndUpdate(
            userId,
            { $set: data, email: newUserEmail },
            { new: true, select: 'nombre apellidos nombreUsuario email rol estado' }
        );

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

    //Creación de usuario
    async createUser(data: CreateUserRequest) {
        //Checa si el email no esta registrada ya
        const userEmail = data.email ? data.email.toLowerCase() : "";
        const emailInUse = await this.userModel.findOne({email: userEmail}).exec() 
        if (emailInUse && emailInUse.email != "" && emailInUse.email != null){
            this.throwRpcException('Este correo ya está registrado', 'BadRequestException', HttpStatus.BAD_REQUEST);
        }

        //Checa si el userName no esta registrada ya
        const userNameInUse = await this.userModel.findOne({nombreUsuario: data.nombreUsuario}).exec()
        if (userNameInUse){
            this.throwRpcException('Este nombre de usuario ya está registrado', 'BadRequestException', HttpStatus.BAD_REQUEST);
        }
        
        const hashedPassword = await bcrypt.hash(data.password.trim(), 10);
        
        await new this.userModel({
            ...data,
            email: userEmail,
            password: hashedPassword,
        }).save();
        
        return { message: `Usuario creado correctamente` };
    }

    async updateUserPersonal(userId: string, dtoUpdateUserPersonal: UpdatePersonalInfoDto) {
        const user = await this.getUserById(userId);
        const { _id: _, ...data } = dtoUpdateUserPersonal; // Excluir _id del DTO

        //checar estado de la cuenta
        this.checkCuentaEstado(user.estado);

        //checar el username
        const newUserName = data.nombreUsuario
        const currentUserName = user.nombreUsuario;
        await this.validateUsername(newUserName, currentUserName);

        const newUserEmail = data.email ? data.email.toLowerCase() : "";
        const currentEmail = user.email
        await this.validateEmail(newUserEmail, currentEmail)
      
        return this.updateUserInDB(userId, newUserEmail, data);
    }

    async updateUser(_id: string, dtoUpdateUser: UpdateUserDto) {
        const user = await this.getUserById(_id);
        const { _id: _, ...data } = dtoUpdateUser; // Excluir _id del DTO

        //checar el username
        const newUserName = data.nombreUsuario || user.nombreUsuario
        const currentUserName = user.nombreUsuario;
        await this.validateUsername(newUserName, currentUserName)

        const newUserEmail = data.email ? data.email.toLowerCase() : "";
        const currentEmail = user.email
        await this.validateEmail(newUserEmail, currentEmail)

        if (data.rol && data.rol !== user.rol) {
            await this.deleteRtUser(_id);
        }
      
        if(data.estado == "false"){
            await this.deleteRtUser(_id);
        }

        if (data.password) {
            const oldPasswordMatches = await bcrypt.compare(data.password, user.password);
            if (!oldPasswordMatches) {
                data.password = await bcrypt.hash(data.password, 10); // Encriptar la contraseña
                await this.deleteRtUser(_id)
            }
        }

        return this.updateUserInDB(_id, newUserEmail, data);
    }

    //Desactivar cuenta
    async deactivateUser(userId: string){
        const user = await this.getUserById(userId);
        const newState = !user.estado;

        const userActualizado = await this.userModel.findByIdAndUpdate(
            userId,
            { $set: { estado: newState } },
            { new: true, select: 'nombre apellidos nombreUsuario email rol estado' }
        );
        if (newState === false) {
            await this.deleteRtUser(userId); // Solo elimina RT si se desactivó
        }
        return userActualizado;
    }

    //Cambiar contraseña
    async changePassword(userId: string, newPassword: string){
        const user = await this.getUserById(userId);
        if (user.estado == false){
            this.throwRpcException(`Este usuario ha sido desactivado`, 'Unauthorized', 403);
        }
        user.password = newPassword;
        await user.save();
        return { message: "Contraseña cambiada con éxito" };
    }

    //Buscar usuario por email
    async getUserByEmail(email: string){
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            this.throwRpcException(`Usuario con email ${email} no encontrado.`, 'BadRequestException', HttpStatus.BAD_REQUEST);
        }
        return user;
    }

    //Buscar usuario por nombre de Usuario
    async getUserByUserName(nombreUsuario: string){
        const user = await this.userModel.findOne({ nombreUsuario }).exec();
        if (!user) {
            this.throwRpcException(`Usuario con nombre de usuario ${nombreUsuario} no encontrado.`, 
                'BadRequestException', HttpStatus.BAD_REQUEST);
        }
        return user;
    }

    //Buscar usuario por id
    async getUserById(userId: string) {
        const user = await this.userModel.findOne({ _id: userId }).exec();
        if (!user) {
            this.throwRpcException(`Usuario con id ${userId} no encontrado.`, 'NotFoundException', HttpStatus.NOT_FOUND);
        }
        return user; 
    }
      

    //Buscar usuario por id y obtener solo ciertos datos
    async getUserByIdInfo(userId: string){
        const user = await this.userModel.findOne({ _id: userId })
            .select('nombre apellidos nombreUsuario email rol estado').exec();
        if (!user) {
            this.throwRpcException(`Usuario con id ${userId} no encontrado.`, 'NotFoundException', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    //Actualizar el rt del usuario
    async updateRtHash(userId: string, rt: string){
        const hash = await bcrypt.hash(rt, 10);
        await this.userModel.updateOne(
            { _id: userId },
            { $set: { hashRefreshToken: hash } }
        );
    }

    //Eliminar el rt del usuario
    async deleteRtUser(userId: string) {
            // Verificar si el usuario existe
            const user = await this.getUserById(userId);
    
            // Intentar actualizar el hashRefreshToken a null
            const result = await this.userModel.updateOne(
                { _id: userId },
                { $set: { hashRefreshToken: null } }
            );
            return { message: "Cerrado de sesión exitoso" };
    }

    //PENDIENTE ..... Esto seria para lo del forgot password si es que se desa continuarlo
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
