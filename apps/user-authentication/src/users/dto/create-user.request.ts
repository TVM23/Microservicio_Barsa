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

    //@IsStrongPassword({}, { message: "Debes poner una contraseña fuerte" })
    //public password: string;

    @IsString()
    @IsStrongPassword({
        minLength: 8,          
        minLowercase: 1,        
        minUppercase: 1,        
        minNumbers: 1,         
        minSymbols: 1           
    }, { message: "La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un símbolo." })
    public password: string;

    @IsIn(["admin", "usuario"], { message: "Rol inválido" })
    public rol: string;
}
