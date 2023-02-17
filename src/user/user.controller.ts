import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { SetProfileBodyDto } from './dto/body/set-profile.body.dto';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtPayload } from '../auth/auth.service';
import { PlaylistGetDetailResponseDto } from '../playlist/dto/response/playlist-get-detail.response.dto';
import { LikeDto } from '../like/dto/like.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '프로필 설정',
    description: '프로필을 설정합니다.',
  })
  @ApiCookieAuth('token')
  @Post('/profile/set')
  @UseGuards(JwtAuthGuard)
  async setProfile(
    @Req() { user }: { user: JwtPayload },
    @Body() body: SetProfileBodyDto,
  ): Promise<void> {
    await this.userService.setProfile(user.id, body.image);
  }

  @ApiOperation({
    summary: '닉네임 변경',
    description: '닉네임을 변경합니다.',
  })
  @ApiCookieAuth('token')
  @Post('/username')
  @UseGuards(JwtAuthGuard)
  async setUsername(
    @Req() { user }: { user: JwtPayload },
    @Body('username') username: string,
  ): Promise<void> {
    await this.userService.setUsername(user.id, username);
  }

  @ApiOperation({
    summary: '유저가 구독중인 플레이리스트 목록',
    description: '유저가 구독중인 플레이리스트 목록을 가져옵니다.',
  })
  @ApiOkResponse({
    description: '플레이리스트 목록',
    type: () => PlaylistGetDetailResponseDto,
    isArray: true,
  })
  @ApiCookieAuth('token')
  @Get('/playlists')
  @UseGuards(JwtAuthGuard)
  async getUserPlaylists(
    @Req() req: Request,
  ): Promise<Array<PlaylistGetDetailResponseDto>> {
    const playlists = await this.userService.getUserPlaylists(
      (req.user as JwtPayload).id,
    );
    return playlists;
  }

  @ApiOperation({
    summary: '유저가 좋아요를 누른 노래 목록',
    description: '유저가 좋아요를 누른 노래 목록을 가져옵니다.',
  })
  @ApiOkResponse({
    description: '노래 목록',
    type: () => LikeDto,
    isArray: true,
  })
  @ApiCookieAuth('token')
  @Get('/likes')
  @UseGuards(JwtAuthGuard)
  async getUserLikes(@Req() req): Promise<Array<LikeDto>> {
    const likes = await this.userService.getUserLikes((req as JwtPayload).id);

    return likes;
  }
}
