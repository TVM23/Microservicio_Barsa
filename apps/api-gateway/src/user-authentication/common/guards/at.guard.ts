import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext){
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass(),
        ])

        if(isPublic)
            return true;

        return super.canActivate(context);
    }

    handleRequest(err, user) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user; // Asegura que el usuario autenticado esté en `req.user`
    }
}