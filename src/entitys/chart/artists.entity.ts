import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'artists' })
export class ArtistsEntity extends BaseEntity {
  @ApiProperty({ description: '아티스트' })
  @PrimaryColumn({ unique: true })
  artist: string;

  @ApiProperty({ description: '아티스트가 참여한 곡들' })
  @Column()
  ids: string;

  constructor(partial: Partial<ArtistsEntity>) {
    super();
    Object.assign(this, partial);
  }
}
