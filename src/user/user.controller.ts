import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { SetProfileBodyDto } from './dto/body/set-profile.body.dto';
import { UserEntity } from '../entitys/user/user.entity';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { PlaylistService } from '../playlist/playlist.service';
import { PlaylistEntity } from '../entitys/user/playlist.entity';
import { JwtPayload } from '../auth/auth.service';
import { LikeEntity } from '../entitys/like/like.entity';
import { LikeService } from '../like/like.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly playlistService: PlaylistService,
    private readonly likeService: LikeService,
  ) {}

  @ApiOperation({
    summary: '프로필 설정',
    description: '프로필을 설정합니다.',
  })
  @ApiCookieAuth('token')
  @Post('/profile/set')
  @UseGuards(JwtAuthGuard)
  async setProfile(@Body() body: SetProfileBodyDto) {
    const user = await this.userService.setProfile(body);
    if (!user) throw new NotFoundException();
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
    type: () => PlaylistEntity,
    isArray: true,
  })
  @ApiCookieAuth('token')
  @Get('/playlists')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async getPlaylists(@Req() req: Request): Promise<Array<PlaylistEntity>> {
    const playlists = await this.playlistService.findByClientId(
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
    type: () => LikeEntity,
    isArray: true,
  })
  @ApiCookieAuth('token')
  @Get('/likes')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async getLikes(@Req() req): Promise<Array<LikeEntity>> {
    const likes = await this.likeService.findByUserId((req as JwtPayload).id);
    return likes;
  }
}
