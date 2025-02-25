import { PartialType } from "@nestjs/mapped-types";
import { CreateUserRequest } from "./create-user.request";
import { IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class UpdateUserDto extends PartialType(CreateUserRequest) {

    @IsString()
    public _id: string
    
    @IsOptional()
    @IsString()
    public estado?: string
}