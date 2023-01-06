import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { SetProfileBodyDto } from './dto/body/set-profile.body.dto';
import { UserEntity } from '../entitys/user/user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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

  @Get('/playlists')
  @UseGuards(JwtAuthGuard)
  async getPlaylists(@Req() req: Request): Promise<Array<PlaylistEntity>> {
    const playlists = await this.playlistService.findByClientId(
      (req.user as JwtPayload).id,
    );
    return playlists;
  }
}
