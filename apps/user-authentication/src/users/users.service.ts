import * as bcrypt from 'bcryptjs';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreateUserRequest, GetUsersFiltersDto, UpdateUserDto, UpdatePersonalInfoDto, Role } from '@app/contracts';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {

    constructor (
        private readonly usersRepository: UsersRepository,
        //@InjectModel(ResetToken.name) private readonly resetTokenModel: Model<ResetToken>
     ) {}

    private throwRpcException(message: string, error: string, status: number): never {
        throw new RpcException({ message, error, status });
    }

    private async validateUsername(newUserName: string, currentUserName: string) {
        if(currentUserName != newUserName){
            const userNameCheck = await this.usersRepository.findByUserName(newUserName);
            if (userNameCheck){
                this.throwRpcException(`Este nombre de usuario ${newUserName} ya está registrado`,'BadRequestException', HttpStatus.BAD_REQUEST);
            }
        }
    }
    
    private async validateEmail(newUserEmail: string, currentEmail: string){
        if(currentEmail != newUserEmail && newUserEmail != "" ){
            const userEmailCheck = await this.usersRepository.findByEmail(newUserEmail); 
            if (userEmailCheck) {
                this.throwRpcException(`Ya existe otra cuenta registrada con el email ${newUserEmail}.`, 'BadRequestException', HttpStatus.BAD_REQUEST);
            }
        }
    }

    private checkCuentaEstado(estado: boolean){
        if (!estado){
            this.throwRpcException(`Este usuario ha sido desactivado`, 'Unauthorized', 403);
        }
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
        return this.usersRepository.findWithFilters(query);
    }

    //Creación de usuario
    async createUser(data: CreateUserRequest, rol: string) {
        if(rol as Role == Role.ADMIN && data.rol == Role.SUPERADMIN){
            this.throwRpcException('Este usuario no tiene permisos para crear el usuario nuevo con el rol seleccionado', 'BadRequestException', HttpStatus.BAD_REQUEST);
        }
        //Checa si el email no esta registrada ya
        const userEmail = data.email ? data.email.toLowerCase() : "";
        const emailInUse = await this.usersRepository.findByEmail(userEmail);
        if (emailInUse && emailInUse.email != "" && emailInUse.email != null){
            this.throwRpcException('Este correo ya está registrado', 'BadRequestException', HttpStatus.BAD_REQUEST);
        }

        //Checa si el userName no esta registrada ya
        const userNameInUse = await this.usersRepository.findByUserName(data.nombreUsuario);
        if (userNameInUse){
            this.throwRpcException('Este nombre de usuario ya está registrado', 'BadRequestException', HttpStatus.BAD_REQUEST);
        }
        
        const hashedPassword = await bcrypt.hash(data.password.trim(), 10);

        await this.usersRepository.create({...data, email: userEmail, password: hashedPassword});
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
        return this.usersRepository.updateById(userId, data, newUserEmail);
    }

    async updateUser(_id: string, dtoUpdateUser: UpdateUserDto, rolUsuarioLogeado: string) {
        const user = await this.getUserById(_id);
        if((user.rol == Role.SUPERADMIN || user.rol == Role.ADMIN) && rolUsuarioLogeado == Role.ADMIN.toString()){
            this.throwRpcException('No tienes permiso para modificar este usuario', 'BadRequestException', HttpStatus.BAD_REQUEST);
        }
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

        if (data.password) {
            const oldPasswordMatches = await bcrypt.compare(data.password, user.password);
            if (!oldPasswordMatches) {
                data.password = await bcrypt.hash(data.password, 10); // Encriptar la contraseña
                await this.deleteRtUser(_id)
            }
        }
        return this.usersRepository.updateById(_id, data, newUserEmail);
    }

    //Desactivar cuenta
    async deactivateUser(userId: string, rolUsuarioLogeado: string, idLogeado: string){
        const user = await this.getUserById(userId);
        if(userId == idLogeado){
            this.throwRpcException('No te puedes desactivar a ti mismo', 'BadRequestException', HttpStatus.BAD_REQUEST);
        }
        if((user.rol == Role.SUPERADMIN || user.rol == Role.ADMIN) && rolUsuarioLogeado == Role.ADMIN.toString()){
            this.throwRpcException('No tienes permiso para desactivar a este usuario', 'BadRequestException', HttpStatus.BAD_REQUEST);
        }

        const newState = !user.estado;
        const updatedUser = await this.usersRepository.deactivateUser(userId, newState);
        if (!newState) await this.deleteRtUser(userId); // Solo elimina RT si se desactivó
        return updatedUser;
    }

    //Cambiar contraseña
    async changePassword(userId: string, newPassword: string){
        const user = await this.getUserById(userId);
        this.checkCuentaEstado(user.estado);
        user.password = newPassword;
        await user.save();
        return { message: "Contraseña cambiada con éxito" };
    }

    //Buscar usuario por email
    async getUserByEmail(email: string){
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            this.throwRpcException(`Usuario con email ${email} no encontrado.`, 'BadRequestException', HttpStatus.BAD_REQUEST);
        }
        return user;
    }

    //Buscar usuario por nombre de Usuario
    async getUserByUserName(nombreUsuario: string){
        const user = await this.usersRepository.findByUserName(nombreUsuario);
        if (!user) {
            this.throwRpcException(`Usuario con nombre de usuario ${nombreUsuario} no encontrado.`, 'BadRequestException', HttpStatus.BAD_REQUEST);
        }
        return user;
    }

    //Buscar usuario por id
    async getUserById(userId: string) {
        const user = await this.usersRepository.findById(userId);
        if (!user) {
            this.throwRpcException(`Usuario con id ${userId} no encontrado.`, 'NotFoundException', HttpStatus.NOT_FOUND);
        }
        return user; 
    }
      

    //Buscar usuario por id y obtener solo ciertos datos
    async getUserByIdInfo(userId: string) {
        const user = await this.getUserById(userId);
        const { password, hashRefreshToken, ...userData } = user.toObject();
        return userData;
    }

    //Actualizar el rt del usuario
    async updateRtHash(userId: string, rt: string){
        const hash = await bcrypt.hash(rt, 10);
        await this.usersRepository.updateRtHash(userId, hash);
    }

    //Eliminar el rt del usuario
    async deleteRtUser(userId: string) {
        const user = await this.getUserById(userId);
        const result = await this.usersRepository.deleteRtUser(userId);
        return { message: "Cerrado de sesión exitoso" };
    }

    //PENDIENTE ..... Esto seria para lo del forgot password si es que se desa continuarlo
    /*async saveResetToken(resetToken: string, userId: string){
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1)
        await this.resetTokenModel.create({
            token: resetToken,
            userId: userId,
            expiryDate: expiryDate
        })
    }*/

}
