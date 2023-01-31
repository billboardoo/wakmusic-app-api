import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
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
import { PlaylistDetailResponseDto } from './dto/response/playlist-detail.response.dto';
import { PlaylistEditBodyDto } from './dto/body/playlist-edit.body.dto';
import { Request } from 'express';
import { JwtPayload } from '../auth/auth.service';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RecommendPlaylistEntity } from '../entitys/like/playlist.entity';
import { AddToMyPlaylistBodyDto } from './dto/body/add-to-my-playlist.body.dto';

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
    type: () => RecommendPlaylistEntity,
    isArray: true,
  })
  @Get('/recommended')
  async findPlaylistRecommended(): Promise<Array<RecommendPlaylistEntity>> {
    const playlists = await this.playlistService.findPlaylistRecommended();

    return playlists;
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
    @Body() body: PlaylistCreateBodyDto,
  ): Promise<PlaylistCreateResponseDto> {
    const playlist = await this.playlistService.create(body);
    if (!playlist) throw new InternalServerErrorException();

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
    type: () => PlaylistEntity,
  })
  @Get('/:key/detail')
  async getDetail(@Param('key') key: string): Promise<PlaylistEntity> {
    const playlist = await this.playlistService.findOne(key);
    if (!playlist) throw new NotFoundException();

    return playlist;
  }

  @ApiOperation({
    summary: '플레이리스트 수정',
    description: '플레이리스트를 수정합니다.',
  })
  @ApiCreatedResponse()
  @ApiCookieAuth('token')
  @Patch('/:key/edit')
  @UseGuards(JwtAuthGuard)
  async editPlaylist(
    @Req() req: Request,
    @Param('key') key: string,
    @Body() body: PlaylistEditBodyDto,
  ): Promise<void> {
    if ((req.user as JwtPayload).id !== body.clientId)
      throw new BadRequestException('개인의 플레이리스트만 수정가능합니다.');

    const playlist = await this.playlistService.edit(key, body);

    if (!playlist) throw new InternalServerErrorException();
  }

  @ApiOperation({
    summary: '플레이리스트 삭제',
    description: '플레이리스트를 삭제합니다',
  })
  @ApiCreatedResponse()
  @ApiCookieAuth('token')
  @Delete('/:key/delete')
  @UseGuards(JwtAuthGuard)
  async deletePlaylist(
    @Req() req: Request,
    @Param('key') key: string,
  ): Promise<void> {
    const playlist = await this.playlistService.delete(
      key,
      (req.user as JwtPayload).id,
    );
    if (!playlist) throw new InternalServerErrorException();
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
  async addSubscriber(
    @Param('key') key: string,
    @Body() body: AddToMyPlaylistBodyDto,
  ): Promise<PlaylistCreateResponseDto> {
    const playlist = await this.playlistService.addToMyPlaylist(
      key,
      body.creatorId,
    );

    if (!playlist) throw new InternalServerErrorException();

    return {
      key: playlist.key,
    };
  }
}
