import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async fineOne() {
    return 'test';
  }
}
