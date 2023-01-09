import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { LikeManagerEntity } from './manager.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'like' })
export class LikeEntity extends BaseEntity {
  @ApiProperty({ description: '고유 id' })
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '노래 id' })
  @Column({ nullable: false, unique: true })
  song_id: string;

  @ApiProperty({ description: '좋아요 수' })
  @Column({ nullable: false, default: 0 })
  likes: number;

  @OneToMany(() => LikeManagerEntity, (likeManager) => likeManager.like)
  managers: Array<LikeManagerEntity>;
}
