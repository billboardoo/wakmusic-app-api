import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  DecodedIdToken,
  Profile,
  VerifyCallback,
} from 'passport-apple';
import process from 'process';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(private readonly jwtService: JwtService) {
    super({
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      callbackURL: process.env.APPLE_CALLBACK_URL,
      failureRedirect: process.env.DOMAIN,
      keyID: process.env.APPLE_KEY_ID,
      privateKeyString: process.env.APPLE_KEY.replace(/\\n/g, '\n'),
      passReqToCallback: false,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    idToken: string,
    profile: Profile,
    verified: VerifyCallback,
  ) {
    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ...this.jwtService.decode(idToken),
      provider: 'apple',
    };
  }
}
