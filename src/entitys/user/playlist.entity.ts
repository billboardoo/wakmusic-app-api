import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity('playlist_v2')
export class PlaylistEntity extends BaseEntity {
  @ApiProperty()
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '플레이리스트 고유 key' })
  @Column({ unique: true })
  key: string;

  @ApiProperty({ description: '플레이리스트 이름' })
  @Column()
  title: string;

  @ApiProperty({ description: '생성자 OAuth Id' })
  @Column()
  creator_id: string;

  @ApiProperty({ description: '플레이리스트 프로필 타입' })
  @Column()
  image: string;

  @ApiProperty({ description: '플레이리스트 노래 목록' })
  @Column('simple-array')
  songlist: Array<string>;

  constructor(partial: Partial<PlaylistEntity>) {
    super();
    Object.assign(this, partial);
  }
}
