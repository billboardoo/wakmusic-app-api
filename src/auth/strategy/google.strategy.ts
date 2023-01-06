import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import * as process from 'process';
import { baseUrl } from '../../utils/path.utils';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.OAUTH_GOOGLE_ID,
      clientSecret: process.env.OAUTH_GOOGLE_SECRET,
      callbackURL: baseUrl + process.env.OAUTH_GOOGLE_REDIRECT,
      failureRedirect: process.env.DOMAIN,
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, displayName, emails } = profile;

    return {
      ...profile,
      provider: 'google',
    };
  }
}
