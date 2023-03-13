import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaylistVersionEntity } from 'src/entitys/version/playlist.entity';
import { ProfileVersionEntity } from 'src/entitys/version/profile.entity';
import { RecommendedPlaylistVersionEntity } from 'src/entitys/version/recommended-playlist.entitiy';
import { Repository } from 'typeorm';
import { ArtistVersionEntity } from '../entitys/version/artist.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ArtistVersionEntity, 'version')
    private readonly artistRepository: Repository<ArtistVersionEntity>,
    @InjectRepository(RecommendedPlaylistVersionEntity, 'version')
    private readonly recommendedPlaylistRepository: Repository<RecommendedPlaylistVersionEntity>,
    @InjectRepository(PlaylistVersionEntity, 'version')
    private readonly playlistRepository: Repository<PlaylistVersionEntity>,
    @InjectRepository(ProfileVersionEntity, 'version')
    private readonly profileRepository: Repository<ProfileVersionEntity>,
  ) {}

  async getArtistImageVersion(artist: string): Promise<ArtistVersionEntity> {
    return await this.artistRepository.findOne({
      where: {
        artist: artist,
      },
    });
  }

  async getRecommendedPlaylistImageVersion(
    playlist_id: string,
  ): Promise<RecommendedPlaylistVersionEntity> {
    return await this.recommendedPlaylistRepository.findOne({
      where: {
        name: playlist_id,
      },
    });
  }

  async getPlaylistImageVersion(
    image_id: string,
  ): Promise<PlaylistVersionEntity> {
    return await this.playlistRepository.findOne({
      where: {
        type: image_id,
      },
    });
  }

  async getProfileImageVersion(
    profile_type: string,
  ): Promise<ProfileVersionEntity> {
    const profile_version = await this.profileRepository.findOne({
      where: {
        type: profile_type,
      },
    });
    if (!profile_version)
      throw new BadRequestException('profile version not found');

    return profile_version;
  }
}
