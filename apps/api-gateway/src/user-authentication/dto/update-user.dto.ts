import { PartialType } from "@nestjs/mapped-types";
import { CreateUserRequest } from "./create-user.request";
import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserRequest) {

    @IsOptional()
    @IsString()
    public estado?: string
}