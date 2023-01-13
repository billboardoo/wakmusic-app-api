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
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('like')
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @ApiOperation({ summary: '좋아요 수', description: '좋아요를 가져옵니다.' })
  @ApiOkResponse({ description: '좋아요 entity', type: () => LikeEntity })
  @ApiCookieAuth('token')
  @Get('/:songId')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async fineOne(@Param('songId') songId: string): Promise<LikeEntity> {
    const like = await this.likeService.findOne(songId);
    if (!like) throw new NotFoundException();

    return like;
  }

  @ApiOperation({ summary: '좋아요 추가', description: '좋아요를 추가합니다.' })
  @ApiOkResponse({
    description: '좋아요가 추가된 entity',
    type: () => LikeEntity,
  })
  @ApiCookieAuth('token')
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

  @ApiOperation({ summary: '좋아요 제거', description: '좋아요를 제거합니다.' })
  @ApiOkResponse({
    description: '좋아요가 제거된 entity',
    type: () => LikeEntity,
  })
  @ApiCookieAuth('token')
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
