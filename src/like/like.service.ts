import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeEntity } from '../entitys/like/like.entity';
import { Repository } from 'typeorm';
import { LikeManagerEntity } from '../entitys/like/manager.entity';
import { ChartsService } from '../charts/charts.service';
import { LikeDto } from './dto/like.dto';
import { SongsService } from '../songs/songs.service';

@Injectable()
export class LikeService {
  constructor(
    private readonly chartsService: ChartsService,
    private readonly songsService: SongsService,

    @InjectRepository(LikeEntity, 'like')
    private readonly likeRepository: Repository<LikeEntity>,
    @InjectRepository(LikeManagerEntity, 'like')
    private readonly likeManagerRepository: Repository<LikeManagerEntity>,
  ) {}

  async findOne(songId: string): Promise<LikeEntity> {
    const isSongIdExist = await this.chartsService.findOne(songId);
    if (!isSongIdExist) throw new NotFoundException('song not found');

    let like: LikeEntity;

    like = await this.likeRepository.findOne({
      where: {
        song_id: songId,
      },
    });
    if (!like) like = await this.create(songId);

    return like;
  }

  async findByUserId(userId: string): Promise<Array<LikeEntity>> {
    const managers = await this.managerFindByUserId(userId);
    return managers.map((manager) => manager.like);
  }

  async create(songId: string): Promise<LikeEntity> {
    const like = this.likeRepository.create();
    like.song_id = songId;
    return this.likeRepository.save(like);
  }

  async getLike(songId: string): Promise<LikeDto> {
    const like = await this.findOne(songId);
    const song_detail = await this.songsService.findOne(songId);

    return {
      id: like.id,
      song: song_detail,
      likes: like.likes,
    };
  }

  async addLike(songId: string, userId: string): Promise<LikeEntity> {
    const isSongIdExist = await this.chartsService.findOne(songId);
    if (!isSongIdExist) throw new NotFoundException();

    const isAlreadyLiked = await this.managerFindOneBySongIdAndUserId(
      songId,
      userId,
    );
    if (isAlreadyLiked) throw new BadRequestException('already added');

    const manager = await this.managerCreate(songId, userId);
    if (!manager) throw new InternalServerErrorException();

    const like = await this.findOne(songId);
    like.likes += 1;

    return await this.likeRepository.save(like);
  }

  async removeLike(songId: string, userId: string): Promise<LikeEntity> {
    const isSongIdExist = await this.chartsService.findOne(songId);
    if (!isSongIdExist) throw new NotFoundException();

    const isAlreadyLiked = await this.managerFindOneBySongIdAndUserId(
      songId,
      userId,
    );
    if (!isAlreadyLiked) throw new BadRequestException('not liked');

    const manager = await this.managerRemove(songId, userId);
    if (!manager) throw new InternalServerErrorException();

    const like = await this.findOne(songId);
    like.likes -= 1;

    return await this.likeRepository.save(like);
  }

  async managerFindOneBySongIdAndUserId(
    songId: string,
    userId: string,
  ): Promise<LikeManagerEntity> {
    const likeManager = await this.likeManagerRepository.findOne({
      where: {
        song_id: songId,
        user_id: userId,
      },
    });
    return likeManager;
  }

  async managerFindByUserId(userId: string): Promise<Array<LikeManagerEntity>> {
    return await this.likeManagerRepository.find({
      where: {
        user_id: userId,
      },
      relations: ['like'],
    });
  }

  async managerCreate(
    songId: string,
    userId: string,
  ): Promise<LikeManagerEntity> {
    const likeManager = await this.likeManagerRepository.create();
    likeManager.song_id = songId;
    likeManager.user_id = userId;
    likeManager.like = await this.findOne(songId);
    return await this.likeManagerRepository.save(likeManager);
  }
  async managerRemove(
    songId: string,
    userId: string,
  ): Promise<LikeManagerEntity> {
    const likeManager = await this.managerFindOneBySongIdAndUserId(
      songId,
      userId,
    );
    return await this.likeManagerRepository.remove(likeManager);
  }
}
