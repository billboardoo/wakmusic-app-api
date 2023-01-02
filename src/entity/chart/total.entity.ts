import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { MonthlyEntity } from './monthly.entity';
import { DailyEntity } from './daily.entity';
import { WeeklyEntity } from './weekly.entity';
import { HourlyEntity } from './hourly.entity';

@Entity({ name: 'total' })
export class TotalEntity extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  songId: string;

  @Column()
  title: string;

  @Column()
  artist: string;

  @Column({ default: '' })
  remix: string;

  @Column({ default: '' })
  reaction: string;

  @Column()
  date: number;

  @Column()
  views: number;

  @Column()
  last: number;

  constructor(partial: Partial<TotalEntity>) {
    super();
    Object.assign(this, partial);
  }
}
