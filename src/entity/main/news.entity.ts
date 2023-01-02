import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity({ name: 'news' })
export class NewsEntity extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '카페 게시글 아이디' })
  @Column()
  cafeId: number;

  @ApiProperty({ description: '뉴스 제목' })
  @Column()
  title: string;

  @ApiProperty({ description: '뉴스 유형' })
  @Column()
  type: number;

  @ApiProperty({ description: '업로드 주차' })
  @Column()
  time: string;

  constructor(partial: Partial<NewsEntity>) {
    super();
    Object.assign(this, partial);
  }
}
