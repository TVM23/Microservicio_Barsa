import { Role } from "apps/api-gateway/src/user-authentication/enums/role.enum";
import { IsEmail, IsString, IsStrongPassword, IsOptional, IsIn, IsNotEmpty, Matches, IsEnum } from "class-validator";

export class CreateUserRequest {
    @IsString({message: "Ingresa el nombre de la persona de esta cuenta"})
    @IsNotEmpty({message: "El nombre no puede ir vacio"})
    public nombre: string;

    @IsOptional()
    @IsString()
    public apellidos: string;

    @IsString({message: "Ingresa tu nombre de usuario"})
    @IsNotEmpty({message: "El nombre de usuario no puede ir vacio"})
    public nombreUsuario: string;

    @IsOptional()
    @Matches(/^$|^.+@.+\..+$/, { message: "Debes ingresar un correo válido o dejarlo vacío" })
    public email: string;

    @IsString()
    @IsStrongPassword({
        minLength: 8,          
        minLowercase: 1,        
        minUppercase: 1,        
        minNumbers: 1,         
        minSymbols: 1           
    }, { message: "La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un símbolo." })
    public password: string;

    @IsEnum(Role, { message: "Rol inválido" })  // Valida usando el enum
    public rol: Role;
}
