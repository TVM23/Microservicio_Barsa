import { IsEmail, IsString, IsStrongPassword, IsOptional, IsIn } from "class-validator";

export class LoginDto {

    @IsEmail({}, { message: "Debes ingresar un correo válido" })
    public email: string;

    
    @IsString()
    public password: string;
}

    
