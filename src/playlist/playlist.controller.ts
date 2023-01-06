import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistEntity } from '../entitys/user/playlist.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async fineAll(): Promise<Array<PlaylistEntity>> {
    return await this.playlistService.findAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<PlaylistEntity> {
    const playlist = await this.playlistService.findOne(id);
    if (!playlist) throw new NotFoundException();

    return playlist;
  }
}
