import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { LikeEntity } from './like.entity';

@Entity({ name: 'manager' })
export class LikeManagerEntity extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  song_id: string;

  @Column({ nullable: false })
  user_id: string;

  @ManyToOne(() => LikeEntity, (like) => like.managers)
  like: LikeEntity;
}
