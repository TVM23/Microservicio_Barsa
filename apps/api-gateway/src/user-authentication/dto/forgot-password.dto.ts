import { Transform } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

export class ForgotPasswordDto {

    @IsEmail({}, {message: "Debes ingresar un correo válido"})
    @Transform(({ value }) => value.trim())  
    email: string
}