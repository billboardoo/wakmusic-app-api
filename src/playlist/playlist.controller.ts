import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  Req,
  BadRequestException,
  Patch,
  Delete,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistEntity } from '../entitys/user/playlist.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PlaylistCreateBodyDto } from './dto/body/playlist-create.body.dto';
import { PlaylistCreateResponseDto } from './dto/response/playlist-create.response.dto';
import { PlaylistEditBodyDto } from './dto/body/playlist-edit.body.dto';
import { Request } from 'express';
import { JwtPayload } from '../auth/auth.service';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  OmitType,
} from '@nestjs/swagger';
import { RecommendPlaylistEntity } from '../entitys/like/playlist.entity';
import { FindPlaylistRecommendedResponseDto } from './dto/response/find-playlist-recommended.response.dto';
import { PlaylistGetDetailResponseDto } from './dto/response/playlist-get-detail.response.dto';
import { SuccessDto } from '../dto/success.dto';
import { PlaylistEditTitleBodyDto } from './dto/body/playlist-edit-title.body.dto';

@ApiTags('playlist')
@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @ApiOperation({
    summary: '모든 플레이리스트 목록',
    description: '모든 플레이리스트 목록을 가져옵니다.',
  })
  @ApiOkResponse({
    description: '플레이리스트 목록',
    type: () => PlaylistEntity,
    isArray: true,
  })
  @Get('/')
  async fineAll(): Promise<Array<PlaylistEntity>> {
    return await this.playlistService.findAll();
  }

  @ApiOperation({
    summary: '추천 플레이리스트 목록',
    description: '왁타버스 뮤직팀이 추천하는 플레이리스트 목록을 가져옵니다.',
  })
  @ApiOkResponse({
    description: '추천 플레이리스트 목록',
    type: () => OmitType(RecommendPlaylistEntity, ['song_ids'] as const),
    isArray: true,
  })
  @Get('/recommended')
  async findAllPlaylistRecommended(): Promise<
    Array<Omit<RecommendPlaylistEntity, 'song_ids'>>
  > {
    const playlists = await this.playlistService.findAllPlaylistRecommended();

    return playlists;
  }

  @ApiOperation({
    summary: '추천 플레이리스트 세부 정보',
    description: '왁타버스 뮤직팀이 추천하는 플레이리스트를 가져옵니다.',
  })
  @ApiOkResponse({
    description: '추천 플레이리스트',
    type: () => FindPlaylistRecommendedResponseDto,
  })
  @Get('/recommended/:key')
  async findPlaylistRecommended(
    @Param('key') key: string,
  ): Promise<FindPlaylistRecommendedResponseDto> {
    const playlist = await this.playlistService.findPlaylistRecommended(key);
    if (!playlist) throw new NotFoundException('플레이리스트가 없습니다.');

    return playlist;
  }

  @ApiOperation({
    summary: 'key를 통해 플레이리스트 조회',
    description: 'key를 통해 플레이리스트를 가져옵니다.',
  })
  @ApiOkResponse({
    description: '플레이리스트',
    type: () => PlaylistEntity,
  })
  @Get('/:key')
  async findOne(@Param('key') key: string): Promise<PlaylistEntity> {
    const playlist = await this.playlistService.findOne(key);
    if (!playlist) throw new NotFoundException();

    return playlist;
  }

  @ApiOperation({
    summary: '플레이리스트 생성.',
    description: '플레이리스트를 생성합니다.',
  })
  @ApiCreatedResponse({
    description: '플레이리스트',
    type: () => PlaylistCreateResponseDto,
  })
  @ApiCookieAuth('token')
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() { user }: { user: JwtPayload },
    @Body() body: PlaylistCreateBodyDto,
  ): Promise<PlaylistCreateResponseDto> {
    const playlist = await this.playlistService.create(user.id, body);
    if (!playlist)
      throw new InternalServerErrorException(
        '플레이리스트를 생성하는데 실패하였습니다.',
      );

    return {
      key: playlist.key,
    };
  }

  @ApiOperation({
    summary: '플레이리스트 세부정보',
    description: 'key에 맞는 플레이리스트의 세부정보를 가져옵니다.',
  })
  @ApiOkResponse({
    description: '플레이리스트 세부정보',
    type: () => PlaylistGetDetailResponseDto,
  })
  @Get('/:key/detail')
  async getDetail(
    @Param('key') key: string,
  ): Promise<PlaylistGetDetailResponseDto> {
    const playlist = await this.playlistService.getDetail(key);
    if (!playlist) throw new NotFoundException();

    return playlist;
  }

  @ApiOperation({
    summary: '플레이리스트 곡 목록 수정',
    description: '플레이리스트의 곡 목록을 수정합니다.',
  })
  @ApiOkResponse({
    type: () => SuccessDto,
  })
  @ApiCookieAuth('token')
  @Patch('/:key/edit')
  @UseGuards(JwtAuthGuard)
  async editPlaylist(
    @Req() req: Request,
    @Param('key') key: string,
    @Body() body: PlaylistEditBodyDto,
  ): Promise<SuccessDto> {
    await this.playlistService.edit((req.user as JwtPayload).id, key, body);

    return {
      status: 200,
    };
  }

  @ApiOperation({
    summary: '플레이리스트 이름 수정',
    description: '플레이리스트의 이름을 수정합니다.',
  })
  @ApiOkResponse({
    type: () => SuccessDto,
  })
  @Patch('/:key/edit/title')
  @UseGuards(JwtAuthGuard)
  async editPlaylistTitle(
    @Req() { user }: { user: JwtPayload },
    @Param('key') key: string,
    @Body() body: PlaylistEditTitleBodyDto,
  ): Promise<SuccessDto> {
    await this.playlistService.edit(user.id, key, body);

    return {
      status: 200,
    };
  }

  @ApiOperation({
    summary: '플레이리스트 삭제',
    description: '플레이리스트를 삭제합니다',
  })
  @ApiOkResponse({
    type: () => SuccessDto,
  })
  @ApiCookieAuth('token')
  @Delete('/:key/delete')
  @UseGuards(JwtAuthGuard)
  async deletePlaylist(
    @Req() req: Request,
    @Param('key') key: string,
  ): Promise<SuccessDto> {
    const playlist = await this.playlistService.delete(
      key,
      (req.user as JwtPayload).id,
    );
    if (!playlist) throw new InternalServerErrorException();

    return {
      status: 200,
    };
  }

  @ApiOperation({
    summary: '플레이리스트 가져오기',
    description: '다른 사람의 플레이리스트를 가져옵니다.',
  })
  @ApiCreatedResponse({
    description: '플레이리스트',
    type: () => PlaylistCreateResponseDto,
  })
  @ApiCookieAuth('token')
  @Post('/:key/addToMyPlaylist')
  @UseGuards(JwtAuthGuard)
  async addToMyPlaylist(
    @Req() { user }: { user: JwtPayload },
    @Param('key') key: string,
  ): Promise<PlaylistCreateResponseDto> {
    const playlist = await this.playlistService.addToMyPlaylist(key, user.id);

    if (!playlist) throw new InternalServerErrorException();

    return {
      key: playlist.key,
    };
  }
}
