import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schema/user.schema";
import { ResetToken } from "./schema/reset-token.schema";
import { Model } from "mongoose";

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(ResetToken.name) private readonly resetTokenModel: Model<ResetToken>
    ) {}

    async create(userData: any){
        await new this.userModel(userData).save();
    }

    async findById(userId: string){
        return this.userModel.findById(userId).exec();
    }

    async findByEmail(email: string){
        return this.userModel.findOne({email}).exec();
    }

    async findByUserName(nombreUsuario: string){
        return this.userModel.findOne({nombreUsuario}).exec();
    }

    findWithFilters(filters: any) {
        return this.userModel.find(filters).select('nombre apellidos nombreUsuario email rol estado').exec();
    }

    async updateById(userId: string, data: any, email?: string){
        const updateData = email ? {...data, email} : data;
        return this.userModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, select: 'nombre apellidos nombreUsuario email rol estado' }
        ).exec();
    }

    async updateRtHash(userId: string, hash: string){
        return this.userModel.updateOne(
            { _id: userId },
            { $set: { hashRefreshToken: hash } }
        ).exec();
    }

    async deleteRtUser(userId: string) {
        return this.userModel.updateOne(
            { _id: userId },
            { $set: { hashRefreshToken: null } }
        ).exec();
    }

    async deactivateUser(userId: string, newState: boolean){
        return this.userModel.findByIdAndUpdate(
            userId,
            { $set: { estado: newState } },
            { new: true, select: 'nombre apellidos nombreUsuario email rol estado' }
        ).exec();
    }
}