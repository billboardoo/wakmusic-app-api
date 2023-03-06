import {
  Body,
  Controller,
  Delete,
  Get,
  Next,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
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
import { LoginMobileBodyDto } from './dto/body/login-mobile.body.dto';
import { LoginMobileResponseDto } from './dto/response/login-mobile.response.dto';
import { SuccessDto } from '../core/dto/success.dto';
import { CacheDeactivate } from 'src/core/decorator/cache-deactivate.decorator';

@ApiTags('auth')
@Controller('auth')
@CacheDeactivate()
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
    const { accessToken } = await this.authService.login(req.user as OauthDto);

    res.cookie('token', accessToken, { maxAge: 1000 * 60 * 60 * 24 * 7 });

    res.redirect(process.env.DOMAIN_MYPAGE);
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

    res.redirect(process.env.DOMAIN_MYPAGE);
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

    res.redirect(process.env.DOMAIN_MYPAGE);
  }

  @ApiOperation({
    summary: '모바일 로그인',
    description: '모바일 로그인 엔드포인트 입니다.',
  })
  @ApiCreatedResponse({
    description: '토큰',
    type: () => LoginMobileResponseDto,
  })
  @Post('/login/mobile')
  async loginMobile(
    @Body() body: LoginMobileBodyDto,
  ): Promise<LoginMobileResponseDto> {
    const { accessToken } = await this.authService.login({
      id: body.id,
      provider: body.provider,
    });

    return {
      token: accessToken,
    };
  }

  @ApiOperation({
    summary: '유저 정보',
    description: '유저의 정보를 가져옵니다.',
  })
  @ApiOkResponse({
    description: '유저 정보',
    type: () => AuthResponseDto,
  })
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

  @ApiOperation({
    summary: '회원 탈퇴',
    description: '회원 탈퇴 api 입니다.',
  })
  @ApiOkResponse({
    type: () => SuccessDto,
  })
  @ApiCookieAuth('token')
  @Delete('/remove')
  @UseGuards(JwtAuthGuard)
  async remove(@Req() req: Request): Promise<SuccessDto> {
    await this.userService.remove(req.user as JwtPayload);

    return {
      status: 200,
    };
  }
}
