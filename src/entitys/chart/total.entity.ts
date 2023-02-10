import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'total' })
export class TotalEntity extends BaseEntity {
  @ApiProperty({ description: '음악 id', uniqueItems: true })
  @PrimaryColumn({ unique: true })
  id: string;

  @ApiProperty({ description: '제목' })
  @Column()
  title: string;

  @ApiProperty({ description: '아티스트' })
  @Column()
  artist: string;

  @ApiProperty({ description: '조교', default: '' })
  @Column({ default: '' })
  remix: string;

  @ApiProperty({ description: '반응영상 URL', default: '' })
  @Column({ default: '' })
  reaction: string;

  @ApiProperty({ description: '업로드 날짜' })
  @Column()
  date: number;

  @ApiProperty({ description: '조회수' })
  @Column()
  views: number;

  @ApiProperty({ description: '지난 번 집계 순위' })
  @Column()
  last: number;

  constructor(partial: Partial<TotalEntity>) {
    super();
    Object.assign(this, partial);
  }
}
