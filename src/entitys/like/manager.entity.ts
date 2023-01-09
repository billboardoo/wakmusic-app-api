import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { LikeEntity } from './like.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'manager' })
export class LikeManagerEntity extends BaseEntity {
  @ApiProperty({ description: '고유 id' })
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '노래 id' })
  @Column({ nullable: false })
  song_id: string;

  @ApiProperty({ description: '유저 id' })
  @Column({ nullable: false })
  user_id: string;

  @ApiProperty({
    description: '좋아요',
    type: () => LikeEntity,
  })
  @ManyToOne(() => LikeEntity, (like) => like.managers)
  like: LikeEntity;
}
