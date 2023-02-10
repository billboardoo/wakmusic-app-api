import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'monthly' })
export class MonthlyEntity extends BaseEntity {
  @ApiProperty({ description: '음악 id' })
  @PrimaryColumn({ unique: true })
  id: string;

  @ApiProperty({ description: '증가량' })
  @Column()
  increase: number;

  @ApiProperty({ description: '지난 번 집계 순위' })
  @Column()
  last: number;

  constructor(partial: Partial<MonthlyEntity>) {
    super();
    Object.assign(this, partial);
  }
}
