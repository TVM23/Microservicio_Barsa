import { Transform } from "class-transformer";
import { IsString, IsStrongPassword } from "class-validator";

export class ChangePasswordDto {

    @IsString()
    @Transform(({ value }) => value.trim())  
    oldPassword: string

    @IsString()
    @Transform(({ value }) => value.trim())  
    @IsStrongPassword({
        minLength: 8,          
        minLowercase: 1,        
        minUppercase: 1,        
        minNumbers: 1,         
        minSymbols: 1           
    }, { message: "La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un símbolo." })
    public newPassword: string;
}