import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategy/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entitys/user/user.entity';
import { UserService } from '../user/user.service';
import { AppleStrategy } from './strategy/apple.strategy';
import { NaverStrategy } from './strategy/naver.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { SessionSerializer } from './session.serializer';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    TypeOrmModule.forFeature([UserEntity], 'user'),
    UserModule,
    PassportModule.register({
      session: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    GoogleStrategy,
    AppleStrategy,
    NaverStrategy,
    JwtStrategy,
    SessionSerializer,
  ],
})
export class AuthModule {}
