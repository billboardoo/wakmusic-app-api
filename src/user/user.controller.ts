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
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { PlaylistService } from '../playlist/playlist.service';
import { PlaylistEntity } from '../entitys/user/playlist.entity';
import { JwtPayload } from '../auth/auth.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly playlistService: PlaylistService,
  ) {}

  @ApiOperation({
    summary: '프로필 설정',
    description: '프로필을 설정합니다.',
  })
  @Post('/profile/set')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async setProfile(@Body() body: SetProfileBodyDto) {
    const user = await this.userService.setProfile(body);
    if (!user) throw new NotFoundException();
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
  @Get('/playlists')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async getPlaylists(@Req() req: Request): Promise<Array<PlaylistEntity>> {
    const playlists = await this.playlistService.findByClientId(
      (req.user as JwtPayload).id,
    );
    return playlists;
  }
}
