import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";


type JwtPayload = {
    sub: string;
    email: string;
}

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(
        private readonly configService: ConfigService,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
        })
        
    }

    validate(payload: JwtPayload) {
        return payload
    }
}