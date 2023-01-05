import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-naver';
import * as process from 'process';
import { OAuthUser } from '../../user/user.service';
import { baseUrl } from '../../utils/path.utils';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: baseUrl + process.env.NAVER_CALLBACK_URL,
      failureRedirect: process.env.DOMAIN,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, nickname, email } = profile._json;

    return {
      ...profile,
      provider: 'naver',
    };
  }
}
