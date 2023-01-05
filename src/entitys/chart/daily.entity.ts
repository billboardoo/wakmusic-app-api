import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { TotalEntity } from './total.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'daily' })
export class DailyEntity extends BaseEntity {
  @ApiProperty({ description: '음악 id' })
  @PrimaryColumn({ unique: true })
  id: string;

  @ApiProperty({ description: '증가량' })
  @Column()
  increase: number;

  @ApiProperty({ description: '지난 번 집계 순위' })
  @Column()
  last: number;

  constructor(partial: Partial<DailyEntity>) {
    super();
    Object.assign(this, partial);
  }
}
