import { PartialType } from "@nestjs/mapped-types";
import { CreateUserRequest } from "./create-user.request";
import { IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class UpdateUserDto extends PartialType(CreateUserRequest) {

    @IsString()
    @Transform(({ value }) => value.trim())  
    public _id: string
    
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())  
    public estado?: string
}