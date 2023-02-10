import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'news' })
export class NewsEntity extends BaseEntity {
  @ApiProperty({ description: '카페 게시글 아이디' })
  @PrimaryColumn()
  id: number;

  @ApiProperty({ description: '뉴스 제목' })
  @Column()
  title: string;

  @ApiProperty({ description: '업로드 주차 + 뉴스 유형' })
  @Column()
  time: number;

  constructor(partial: Partial<NewsEntity>) {
    super();
    Object.assign(this, partial);
  }
}
