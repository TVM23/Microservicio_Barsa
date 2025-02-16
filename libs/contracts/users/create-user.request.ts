import { IsEmail, IsString, IsStrongPassword, IsOptional, IsIn } from "class-validator";

export class CreateUserRequest {
    @IsString()
    public nombre: string;

    @IsOptional()
    @IsString()
    public apellidoPaterno?: string;

    @IsOptional()
    @IsString()
    public apellidoMaterno?: string;

    @IsEmail({}, { message: "Debes ingresar un correo válido" })
    public email: string;

    @IsStrongPassword({}, { message: "Debes poner una contraseña fuerte" })
    public password: string;

    @IsIn(["admin", "usuario"], { message: "Rol inválido" })
    public rol: string;
}
