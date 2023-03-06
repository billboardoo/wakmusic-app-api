import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entitys/user/user.entity';
import { Repository } from 'typeorm';
import { OauthDto } from '../auth/dto/oauth.dto';
import { JwtPayload } from '../auth/auth.service';
import * as process from 'process';
import { PlaylistService } from '../playlist/playlist.service';
import { SongsService } from '../songs/songs.service';
import { LikeDto } from '../like/dto/like.dto';
import { LikeService } from '../like/like.service';
import { EditUserLikesBodyDto } from './dto/body/edit-user-likes.body.dto';
import { EditUserPlaylistsBodyDto } from './dto/body/edit-user-playlists.body.dto';
import { PlaylistEntity } from '../entitys/user/playlist.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly playlistService: PlaylistService,
    private readonly likeService: LikeService,
    private readonly songsService: SongsService,

    @InjectRepository(UserEntity, 'user')
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOneById(id: string): Promise<UserEntity> {
    console.log('test');
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');

    return user;
  }
  async findByProviderIdOrSave(OAuthUser: OauthDto): Promise<UserEntity> {
    let user = await this.userRepository.findOne({
      where: {
        id: OAuthUser.id,
        platform: OAuthUser.provider,
      },
    });

    if (!user) user = await this.create(OAuthUser);

    return user;
  }

  async create(OAuthUser: OauthDto): Promise<UserEntity> {
    const newUser = this.userRepository.create();
    newUser.id = OAuthUser.id;
    newUser.displayName = process.env.DEFAULT_NAME;
    newUser.platform = OAuthUser.provider;
    newUser.profile = 'panchi';
    newUser.first_login_time = Date.now();

    const user = await this.userRepository.save(newUser);
    if (!user) throw new InternalServerErrorException();

    return user;
  }

  async setProfile(id: string, image: string): Promise<void> {
    const user = await this.findOneById(id);

    user.profile = image;

    await this.userRepository.save(user);
  }

  async setUsername(id: string, username: string): Promise<void> {
    const user = await this.findOneById(id);
    user.displayName = username;

    await this.userRepository.save(user);
  }

  checkFirstLogin(first_login_time: number): boolean {
    const now = new Date();
    const first_login = new Date(first_login_time);

    return now.toDateString() == first_login.toDateString();
  }

  async remove(user: JwtPayload): Promise<boolean> {
    const targetUser = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
    });
    if (!targetUser) throw new NotFoundException('유저가 없습니다.');

    await this.userRepository.remove(targetUser);

    return true;
  }

  async getUserPlaylists(id: string): Promise<Array<PlaylistEntity>> {
    const playlists = await this.playlistService.findUserPlaylistsByUserId(id);
    const results: Array<PlaylistEntity> = [];

    for (const playlist_id of playlists.playlists) {
      results.push(await this.playlistService.findOne(playlist_id));
    }

    return results;
  }

  async editUserPlaylists(
    id: string,
    body: EditUserPlaylistsBodyDto,
  ): Promise<void> {
    await this.playlistService.editUserPlaylists(id, body.playlists);
  }

  async getUserLikes(id: string): Promise<Array<LikeDto>> {
    const manager = await this.likeService.getManager(id);
    const results: Array<LikeDto> = [];

    for (const song of manager.songs) {
      results.push(await this.likeService.getLike(song));
    }

    return results;
  }

  async editUserLikes(id: string, body: EditUserLikesBodyDto): Promise<void> {
    await this.likeService.editManager(id, body);
  }
}
