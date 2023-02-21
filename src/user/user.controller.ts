import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { SetProfileBodyDto } from './dto/body/set-profile.body.dto';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtPayload } from '../auth/auth.service';
import { PlaylistGetDetailResponseDto } from '../playlist/dto/response/playlist-get-detail.response.dto';
import { LikeDto } from '../like/dto/like.dto';
import { SuccessDto } from '../dto/success.dto';
import { CategoriesService } from '../categories/categories.service';
import { EditUserLikesBodyDto } from './dto/body/edit-user-likes.body.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @ApiOperation({
    summary: '프로필 목록',
    description: '가능한 프로필 사진 목록을 가져옵니다.',
  })
  @ApiOkResponse({
    type: 'string',
    isArray: true,
  })
  @Get('/profile/list')
  async getProfileImages(): Promise<Array<string>> {
    return await this.categoriesService.findCategoriesByType('profile');
  }

  @ApiOperation({
    summary: '프로필 설정',
    description: '프로필을 설정합니다.',
  })
  @ApiCreatedResponse({
    type: () => SuccessDto,
  })
  @ApiCookieAuth('token')
  @Post('/profile/set')
  @UseGuards(JwtAuthGuard)
  async setProfile(
    @Req() { user }: { user: JwtPayload },
    @Body() body: SetProfileBodyDto,
  ): Promise<SuccessDto> {
    await this.userService.setProfile(user.id, body.image);

    return {
      status: 200,
    };
  }

  @ApiOperation({
    summary: '닉네임 변경',
    description: '닉네임을 변경합니다.',
  })
  @ApiCreatedResponse({
    type: () => SuccessDto,
  })
  @ApiCookieAuth('token')
  @Post('/username')
  @UseGuards(JwtAuthGuard)
  async setUsername(
    @Req() { user }: { user: JwtPayload },
    @Body('username') username: string,
  ): Promise<SuccessDto> {
    await this.userService.setUsername(user.id, username);

    return {
      status: 200,
    };
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
    return await this.userService.getUserPlaylists((req.user as JwtPayload).id);
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
    return await this.userService.getUserLikes((req as JwtPayload).id);
  }

  @ApiOperation({
    summary: '유저의 좋아요 목록 편집',
    description: '유저의 좋아요 목록을 수정합니다.',
  })
  @ApiOkResponse({
    type: () => SuccessDto,
  })
  @ApiCookieAuth('token')
  @Patch('/likes/edit')
  @UseGuards(JwtAuthGuard)
  async editUserLikes(
    @Req() req,
    @Body() body: EditUserLikesBodyDto,
  ): Promise<SuccessDto> {
    await this.userService.editUserLikes((req as JwtPayload).id, body);

    return {
      status: 200,
    };
  }
}
