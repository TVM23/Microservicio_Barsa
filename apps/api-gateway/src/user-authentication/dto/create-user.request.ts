import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class CreateUserRequest {

    @IsString()
    public nombre: string

    @IsEmail({}, {message: 'Debes ingresar un correo válido'})
    public email: string;

    @IsStrongPassword({}, {message: 'Debes poner una contraseña fuerte'})
    public password: string;

    @IsString()
    public rol: string;
}