import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategy/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { UserModule } from '../user/user.module';
import { AppleStrategy } from './strategy/apple.strategy';
import { NaverStrategy } from './strategy/naver.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    PassportModule.register({}),
    UserModule,
    ImageModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    AppleStrategy,
    NaverStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
