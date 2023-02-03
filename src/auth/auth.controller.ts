import {
  Controller,
  Get,
  Next,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService, JwtPayload } from './auth.service';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { NaverAuthGuard } from './guard/naver-auth.guard';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { AppleAuthGuard } from './guard/apple-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AuthResponseDto } from './dto/response/auth.response.dto';
import { OauthDto } from './dto/oauth.dto';
import { UserEntity } from '../entitys/user/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('/login/google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(): Promise<void> {
    // redirect to google auth page
  }

  @Get('/callback/google')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    console.log(req.user);
    const { accessToken } = await this.authService.login(req.user as OauthDto);

    res.cookie('token', accessToken, { maxAge: 1000 * 60 * 60 * 24 * 7 });

    res.redirect(process.env.DOMAIN);
  }

  @Get('/login/apple')
  @UseGuards(AppleAuthGuard)
  async appleAuth(): Promise<void> {
    // redirect to apple auth page
  }

  @Post('/callback/apple')
  @UseGuards(AppleAuthGuard)
  async appleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const { accessToken } = await this.authService.login(req.user as OauthDto);

    res.cookie('token', accessToken, { maxAge: 1000 * 60 * 60 * 24 * 7 });

    res.redirect(process.env.DOMAIN);
  }

  @Get('/login/naver')
  @UseGuards(NaverAuthGuard)
  async naverAuth() {
    // redirect to naver auth page
  }

  @Get('/callback/naver')
  @UseGuards(NaverAuthGuard)
  async naverAuthCallback(@Req() req: Request, @Res() res: Response) {
    const { accessToken } = await this.authService.login(req.user as OauthDto);

    res.cookie('token', accessToken, { maxAge: 1000 * 60 * 60 * 24 * 7 });

    res.redirect(process.env.DOMAIN);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async auth(@Req() req: Request): Promise<AuthResponseDto> {
    const userId = (req.user as JwtPayload).id;
    const user = await this.userService.findOneById(userId);
    const first = this.userService.checkFirstLogin(user.first_login_time);

    return {
      ...user,
      first,
    };
  }

  @ApiCookieAuth('token')
  @Get('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res: Response, @Next() next: NextFunction) {
    res.cookie('token', '', { maxAge: 0 });
    res.redirect(process.env.DOMAIN);
  }
}
