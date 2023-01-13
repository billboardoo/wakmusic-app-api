import { Inject, Injectable } from '@nestjs/common';
import { TotalEntity } from '../entitys/chart/total.entity';
import { moment } from '../utils/moment.utils';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindSongsQueryDto } from './dto/query/find-songs.query.dto';
import * as fs from 'fs';
import { lyricsPath, rootPath } from '../utils/path.utils';
import { FindSongsByLyricsResponseDto } from './dto/response/find-songs-by-lyrics.response.dto';
import { CheckLyricsQueryDto } from './dto/query/check-lyrics.query.dto';
import { CheckLyricsResponseDto } from './dto/response/check-lyrics.response.dto';
import { FindSongsByPeriodQueryDto } from './dto/query/find-songs-by-period.query.dto';
import { ArtistService } from '../artist/artist.service';

@Injectable()
export class SongsService {
  constructor(
    @Inject(ArtistService)
    private readonly artistService: ArtistService,

    @InjectRepository(TotalEntity, 'chart')
    private readonly totalRepository: Repository<TotalEntity>,
  ) {}

  async findNewSongs(artist?: string, limit = 10): Promise<Array<TotalEntity>> {
    return await this.totalRepository.find({
      where: {
        artist: artist || null,
      },
      order: {
        date: 'desc',
      },
      take: limit,
    });
  }

  async findNewSongsByMonth(): Promise<Array<TotalEntity>> {
    const time = moment();
    const dateNow = time.format('YYMMDD');
    const dateStart = time.subtract(1, 'months').format('YYMMDD');
    const newSongs = this.totalRepository
      .createQueryBuilder('total')
      .where('total.date <= :dateNow', { dateNow })
      .andWhere('total.date >= :dateStart', { dateStart });

    return await newSongs.getMany();
  }

  async findNewSongsByGroup(group: string): Promise<Array<TotalEntity>> {
    if (group == 'all') return await this.findNewSongs();

    const artists = await this.artistService.findByGroup(group);

    const songs: Array<TotalEntity> = [];

    for (const artist of artists) {
      const artistNewSongs = await this.findNewSongs(artist.name);
      songs.push(...artistNewSongs);
    }

    songs.sort(this._sortSongsByDateDesc);

    if (songs.length < 10) return songs;

    return songs.slice(0, 10);
  }

  private _sortSongsByDateDesc(a: TotalEntity, b: TotalEntity): number {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;

    return 0;
  }

  async findSongsByPeriod(
    query: FindSongsByPeriodQueryDto,
  ): Promise<Array<TotalEntity>> {
    let startDate: string;
    let endDate: string;

    const start = query.start || 0;
    const period = query.period.toString().slice(2);

    if (query.type == 'month') {
      startDate = `${period}00`;
      endDate = `${period}32`;
    } else if (query.type == 'year') {
      startDate = `${period}0100`;
      endDate = `${period}1232`;
    }

    const songs = await this.totalRepository
      .createQueryBuilder('total')
      .where(`total.date >= :startDate`, { startDate })
      .andWhere('total.date <= :endDate', { endDate })
      .getMany();

    return songs.slice(start, start + 30);
  }

  async findSongsBySearch(
    query: FindSongsQueryDto,
  ): Promise<Array<TotalEntity>> {
    const keyword = decodeURI(query.keyword);

    let sort: string;
    let order: boolean;
    if (query.sort == 'new') {
      sort = 'total.date';
      order = true;
    } else if (query.sort == 'old') {
      sort = 'total.date';
      order = false;
    } else if (query.sort == 'popular') {
      sort = 'total.views';
      order = true;
    }

    const songsQueryBuilder = this.totalRepository.createQueryBuilder('total');

    if (query.type == 'ids') {
      songsQueryBuilder.where('total.id IN (:...ids)', {
        ids: keyword.split(','),
      });
    } else {
      songsQueryBuilder.where(`total.${query.type} LIKE :keyword`, {
        keyword: `%${keyword}%`,
      });
    }
    songsQueryBuilder.orderBy(sort, order ? 'DESC' : 'ASC');

    const songs = await songsQueryBuilder.getMany();

    return songs;
  }

  async findSongsByLyrics(): Promise<Array<FindSongsByLyricsResponseDto>> {
    const lyrics = fs.readdirSync(lyricsPath);

    const songs = await this.totalRepository.find({
      select: ['id', 'title', 'artist', 'date'],
      order: {
        views: {
          direction: 'DESC',
        },
      },
    });

    return songs.filter((song) => !lyrics.includes(song.id + '.vtt'));
  }

  async checkLyrics(
    query: CheckLyricsQueryDto,
  ): Promise<CheckLyricsResponseDto> {
    try {
      const checkFile = fs.existsSync(`${lyricsPath}/${query.id}.vtt`);
      if (checkFile) {
        return {
          status: 200,
        };
      } else {
        return {
          status: 404,
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: 404,
      };
    }
  }
}
