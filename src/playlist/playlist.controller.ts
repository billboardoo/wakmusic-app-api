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

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Get('/')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async fineAll(): Promise<Array<PlaylistEntity>> {
    return await this.playlistService.findAll();
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<PlaylistEntity> {
    const playlist = await this.playlistService.findOne(id);
    if (!playlist) throw new NotFoundException();

    return playlist;
  }

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

  @Get('/:key/detail')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async getDetail(@Param('key') key: string): Promise<PlaylistEntity> {
    const playlist = await this.playlistService.findOne(key);
    if (!playlist) throw new NotFoundException();

    return playlist;
  }

  @Post('/:key/edit')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async editPlaylist(
    @Param('key') key: string,
    @Body() body: PlaylistEditBodyDto,
  ): Promise<PlaylistEntity> {
    const playlist = await this.playlistService.edit(key, body);

    if (!playlist) throw new InternalServerErrorException();

    return playlist;
  }

  @Post('/:key/delete')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async deletePlaylist(
    @Req() req: Request,
    @Param('key') key: string,
  ): Promise<PlaylistCreateResponseDto> {
    const playlist = await this.playlistService.delete(
      key,
      (req.user as JwtPayload).id,
    );
    if (!playlist) throw new InternalServerErrorException();

    return playlist;
  }

  @Post('/:key/addSubscriber')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async addSubscriber(
    @Req() req: Request,
    @Param('key') key: string,
    @Body('subscriberId') subscriberId: string,
  ): Promise<PlaylistEntity> {
    if ((req.user as JwtPayload).id !== subscriberId)
      throw new BadRequestException();

    const playlist = await this.playlistService.addSubscriber(
      key,
      subscriberId,
    );

    if (!playlist) throw new InternalServerErrorException();

    return playlist;
  }

  @Post('/:key/removeSubscriber')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async removeSubscriber(
    @Req() req: Request,
    @Param('key') key: string,
    @Body('subscriberId') subscriberId: string,
  ): Promise<PlaylistEntity> {
    if ((req.user as JwtPayload).id !== subscriberId)
      throw new BadRequestException();

    const playlist = await this.playlistService.removeSubscriber(
      key,
      subscriberId,
    );

    if (!playlist) throw new InternalServerErrorException();

    return playlist;
  }
}
