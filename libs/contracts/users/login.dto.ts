import { Transform } from "class-transformer";
import { IsEmail, IsString, IsStrongPassword, IsOptional, IsIn, IsNotEmpty } from "class-validator";

export class LoginDto {

    /*@IsEmail({}, { message: "Debes ingresar un correo válido" })
    public email: string;*/
    @IsString({message: "Debes ingresar el nombre del usuario"})
    @IsNotEmpty({message: "El nombre de usuario no puede ir vacio"})
    @Transform(({ value }) => value.trim())  
    public nombreUsuario: string;

    @IsString({message: "Ingresa la contraseña"})
    @Transform(({ value }) => value.trim())  
    public password: string;
}