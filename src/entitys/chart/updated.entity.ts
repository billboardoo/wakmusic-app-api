import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'updated' })
export class UpdatedEntity extends BaseEntity {
  @ApiProperty({ description: '마지막 차트 업데이트 시간' })
  @PrimaryColumn()
  time: number;

  constructor(partial: Partial<UpdatedEntity>) {
    super();
    Object.assign(this, partial);
  }
}
