import { PartialType } from "@nestjs/mapped-types";
import { CreateUserRequest } from "./create-user.request";
import { IsIn, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class UpdateUserDto extends PartialType(CreateUserRequest) {

    @IsString()
    @Transform(({ value }) => value.trim())  
    public _id: string
    
    @IsOptional()
    @IsString()
    @IsIn(['true', 'false'], { message: 'El estado solo puede ser "true" o "false".' })
    @Transform(({ value }) => value.trim())  
    public estado?: string
}