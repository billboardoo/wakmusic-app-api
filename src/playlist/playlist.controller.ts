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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

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
  @ApiBearerAuth()
  @Get('/')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async fineAll(): Promise<Array<PlaylistEntity>> {
    return await this.playlistService.findAll();
  }

  @ApiOperation({
    summary: 'key를 통해 플레이리스트 조회',
    description: 'key를 통해 플레이리스트를 가져옵니다.',
  })
  @ApiOkResponse({
    description: '플레이리스트',
    type: () => PlaylistEntity,
  })
  @ApiBearerAuth()
  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<PlaylistEntity> {
    const playlist = await this.playlistService.findOne(id);
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @Get('/:key/detail')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async getDetail(@Param('key') key: string): Promise<PlaylistEntity> {
    const playlist = await this.playlistService.findOne(key);
    if (!playlist) throw new NotFoundException();

    return playlist;
  }

  @ApiOperation({
    summary: '플레이리스트 수정',
    description: '플레이리스트를 수정합니다.',
  })
  @ApiCreatedResponse({
    description: '수정된 플레이리스트',
    type: () => PlaylistEntity,
  })
  @ApiBearerAuth()
  @Patch('/:key/edit')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async editPlaylist(
    @Param('key') key: string,
    @Body() body: PlaylistEditBodyDto,
  ): Promise<void> {
    const playlist = await this.playlistService.edit(key, body);

    if (!playlist) throw new InternalServerErrorException();
  }

  @ApiOperation({
    summary: '플레이리스트 삭제',
    description: '플레이리스트를 삭제합니다',
  })
  @ApiCreatedResponse({
    description: '삭제된 플레이리스트',
    type: () => PlaylistEntity,
  })
  @ApiBearerAuth()
  @Delete('/:key/delete')
  @UseInterceptors(ClassSerializerInterceptor)
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
    summary: '플레이리스트 구독자 추가',
    description: '플레이리스트에 구독자를 추가합니다.',
  })
  @ApiCreatedResponse({
    description: '플레이리스트',
    type: () => PlaylistEntity,
  })
  @ApiBearerAuth()
  @Patch('/:key/addSubscriber')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async addSubscriber(
    @Req() req: Request,
    @Param('key') key: string,
    @Body('subscriberId') subscriberId: string,
  ): Promise<void> {
    if ((req.user as JwtPayload).id !== subscriberId)
      throw new BadRequestException();

    const playlist = await this.playlistService.addSubscriber(
      key,
      subscriberId,
    );

    if (!playlist) throw new InternalServerErrorException();
  }

  @ApiOperation({
    summary: '플레이리스트 구독자 제거',
    description: '플레이리스트에서 구독자를 제거합니다.',
  })
  @ApiCreatedResponse({
    description: '플레이리스트',
    type: () => PlaylistEntity,
  })
  @ApiBearerAuth()
  @Patch('/:key/removeSubscriber')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async removeSubscriber(
    @Req() req: Request,
    @Param('key') key: string,
    @Body('subscriberId') subscriberId: string,
  ): Promise<void> {
    if ((req.user as JwtPayload).id !== subscriberId)
      throw new BadRequestException();

    const playlist = await this.playlistService.removeSubscriber(
      key,
      subscriberId,
    );

    if (!playlist) throw new InternalServerErrorException();
  }
}
