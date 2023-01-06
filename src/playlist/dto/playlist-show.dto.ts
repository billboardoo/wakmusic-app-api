import { Exclude, Expose } from 'class-transformer';
import { PlaylistEntity } from '../../entitys/user/playlist.entity';
import { ApiProperty } from '@nestjs/swagger';

export class PlaylistShowDto {
  @Exclude()
  private _key: string;
  @Exclude()
  private _title: string;
  @Exclude()
  private _creator: string;
  @Exclude()
  private _platform: string;
  @Exclude()
  private _image: string;
  @Exclude()
  private _songlist: Array<string>;
  @Exclude()
  private _public: boolean;
  @Exclude()
  private _clientId: string;
  @Exclude()
  private _subscribe: Array<string>;

  constructor(playlist: PlaylistEntity) {
    this._key = playlist.key;
    this._title = playlist.title;
    this._creator = playlist.creator;
    this._platform = playlist.platform;
    this._image = playlist.image;
    this._songlist = playlist.songlist.split('|:|');
    this._public = playlist.public === 'true';
    this._clientId = playlist.clientId;
    this._subscribe = playlist.subscribe.split('|:|');
  }

  @ApiProperty()
  @Expose()
  get key(): string {
    return this._key;
  }

  @ApiProperty()
  @Expose()
  get title(): string {
    return this._title;
  }

  @ApiProperty()
  @Expose()
  get creator(): string {
    return this._creator;
  }

  @ApiProperty()
  @Expose()
  get platform(): string {
    return this._platform;
  }

  @ApiProperty()
  @Expose()
  get image(): string {
    return this._image;
  }

  @ApiProperty()
  @Expose()
  get songlist(): Array<string> {
    return this._songlist;
  }

  @ApiProperty()
  @Expose()
  get public(): boolean {
    return this._public;
  }

  @ApiProperty()
  @Expose()
  get clientId(): string {
    return this._clientId;
  }
  @ApiProperty()
  @Expose()
  get subscribe(): Array<string> {
    return this._subscribe;
  }
}
