import { Role } from "@app/contracts";
import { Transform } from "class-transformer";
import { IsString, IsStrongPassword, IsOptional, IsNotEmpty, Matches, IsEnum } from "class-validator";

export class CreateUserRequest {
    @IsString({message: "Ingresa el nombre de la persona de esta cuenta"})
    @IsNotEmpty({message: "El nombre no puede ir vacio"})
    @Transform(({ value }) => value.trim())  // 🔹 Aplica trim automáticamente
    public nombre: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())  
    public apellidos: string;

    @IsString({message: "Ingresa tu nombre de usuario"})
    @IsNotEmpty({message: "El nombre de usuario no puede ir vacio"})
    @Transform(({ value }) => value.trim())  
    public nombreUsuario: string;

    @IsOptional()
    @Matches(/^$|^.+@.+\..+$/, { message: "Debes ingresar un correo válido o dejarlo vacío" })
    @Transform(({ value }) => value.trim())  
    public email: string;

    @IsString({message: "Debs ingresar la contraseña"})
    @IsStrongPassword({
        minLength: 8,          
        minLowercase: 1,        
        minUppercase: 1,        
        minNumbers: 1,         
        minSymbols: 1           
    }, { message: "La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un símbolo" })
    @Transform(({ value }) => value.trim())  
    public password: string;

    @Transform(({ value }) => value.trim()) 
    @IsEnum(Role, { message: "Rol inválido" })  // Valida usando el enum
    public rol: Role;
}
