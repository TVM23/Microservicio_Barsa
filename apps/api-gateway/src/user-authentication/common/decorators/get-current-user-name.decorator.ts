import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetCurrentUserName = createParamDecorator(
    ( data: undefined,  context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    return request.user['userName'];
})