import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }
  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    let userId: string;
    if (user.provider == 'google') userId = user.id;
    else if (user.provider == 'naver') userId = user._json.id;
    else if (user.provider == 'apple') userId = user.sub;

    const userEntity = this.userService.findOneById(userId);
    if (!userEntity) user['first'] = true;
    else user['first'] = false;

    done(null, user);
  }

  deserializeUser(payload: any, done: (err: Error, user: any) => void): any {
    console.log(payload);
    done(null, payload);
  }
}
