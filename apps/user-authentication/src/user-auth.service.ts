import { Injectable } from '@nestjs/common';

@Injectable()
export class UserAuthService {
  getHello(): string {
    return 'Hello World!';
  }
}
