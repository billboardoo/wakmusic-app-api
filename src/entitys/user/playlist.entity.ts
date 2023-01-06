import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

@Entity('playlist')
export class PlaylistEntity extends BaseEntity {
  @ApiProperty({ description: '플레이리스트 고유 key' })
  @PrimaryColumn()
  key: string;

  @ApiProperty({ description: '플레이리스트 이름' })
  @Column()
  title: string;

  @ApiProperty({ description: '플레이리스트 생성자' })
  @Column()
  creator: string;

  @ApiProperty({ description: '생성자 OAuth 타입' })
  @Column()
  platform: string;

  @ApiProperty({ description: '플레이리스트 프로필 타입' })
  @Column()
  image: string;

  @ApiProperty({ description: '(|:|)로 구분된 재생 목록' })
  @Transform(({ value }) => value.split('|:|'))
  @Column()
  songlist: string;

  @ApiProperty({ description: '공개 여부' })
  @Column()
  public: string;

  @ApiProperty({ description: '생성자 OAuth Id' })
  @Column()
  clientId: string;

  @ApiProperty({ description: '(|:|)로 구분된 구독자 목록' })
  @Transform(({ value }) => value.split('|:|'))
  @Column()
  subscribe: string;

  constructor(partial: Partial<PlaylistEntity>) {
    super();
    Object.assign(this, partial);
  }
}
