import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeEntity } from '../entitys/like/like.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { JwtPayload } from '../auth/auth.service';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Get('/:songId')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async fineOne(@Param('songId') songId: string): Promise<LikeEntity> {
    const like = await this.likeService.findOne(songId);
    if (!like) throw new NotFoundException();

    return like;
  }

  @Post('/:songId/addLike')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async addLike(
    @Req() req,
    @Param('songId') songId: string,
  ): Promise<LikeEntity> {
    const like = await this.likeService.addLike(
      songId,
      (req.user as JwtPayload).id,
    );
    if (!like) throw new NotFoundException();

    return like;
  }

  @Post('/:songId/removeLike')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async removeLike(
    @Req() req,
    @Param('songId') songId: string,
  ): Promise<LikeEntity> {
    const like = await this.likeService.removeLike(
      songId,
      (req.user as JwtPayload).id,
    );
    if (!like) throw new NotFoundException();

    return like;
  }
}
