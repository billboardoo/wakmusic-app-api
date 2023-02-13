import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-apple';
import * as process from 'process';
import { JwtService } from '@nestjs/jwt';
import { OauthDto } from '../dto/oauth.dto';

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
  ): Promise<OauthDto> {
    const decodedObj = this.jwtService.decode(idToken);
    if (!decodedObj.sub) throw new UnauthorizedException();

    return {
      id: decodedObj.sub,
      provider: 'apple',
    };
  }
}
