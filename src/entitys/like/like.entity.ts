import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { LikeManagerEntity } from './manager.entity';

@Entity({ name: 'like' })
export class LikeEntity extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  song_id: string;

  @Column({ nullable: false, default: 0 })
  likes: number;

  @OneToMany(() => LikeManagerEntity, (likeManager) => likeManager.like)
  managers: Array<LikeManagerEntity>;
}
