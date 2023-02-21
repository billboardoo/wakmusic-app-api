import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

@Entity({ name: 'like' })
export class LikeEntity extends BaseEntity {
  @ApiModelProperty({ description: '고유 id' })
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '노래 id' })
  @Column({ type: 'text', nullable: false, unique: true })
  song_id: string;

  @ApiProperty({ description: '좋아요 수' })
  @Column({ type: 'int', nullable: false, default: 0 })
  likes: number;
}
