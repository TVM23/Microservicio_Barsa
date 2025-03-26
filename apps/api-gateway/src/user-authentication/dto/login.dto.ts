import { IsEmail, IsString, IsStrongPassword, IsOptional, IsIn, IsNotEmpty } from "class-validator";

export class LoginDto {

    /*@IsEmail({}, { message: "Debes ingresar un correo válido" })
    public email: string;*/
    @IsString()
    @IsNotEmpty({message: "El nombre de usuario no puede ir vacio"})
    public nombreUsuario: string;

    @IsString()
    public password: string;
}