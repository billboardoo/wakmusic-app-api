import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'artists' })
export class MainArtistsEntity extends BaseEntity {
  @ApiProperty({ description: '아티스트 id' })
  @PrimaryColumn()
  id: string;

  @ApiProperty({ description: '이름' })
  @Column()
  name: string;

  @ApiProperty({ description: '짧은 이름' })
  @Column()
  short: string;

  @ApiProperty({ description: '소속 그룹' })
  @Column()
  group: string;

  @ApiProperty({ description: '한 줄 소개' })
  @Column()
  title: string;

  @ApiProperty({ description: '긴 소개글' })
  @Column()
  description: string;

  @ApiProperty({ description: 'HEX 색깔 코드 (text 형식)' })
  @Column()
  color: string;

  @ApiProperty({ description: '유튜브 URL' })
  @Column()
  youtube: string;

  @ApiProperty({ description: '트위치 URL' })
  @Column()
  twitch: string;

  @ApiProperty({ description: '인스타그램 URL' })
  @Column()
  instagram: string;

  constructor(partial: Partial<MainArtistsEntity>) {
    super();
    Object.assign(this, partial);
  }
}
