import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

const teamType = ['website', 'ios', 'android', 'special', 'news'] as const;

@Entity({ name: 'teams' })
export class TeamsEntity extends BaseEntity {
  @ApiProperty({ description: '소속팀' })
  @PrimaryColumn()
  team: string;

  @ApiProperty({ description: '닉네임' })
  @Column()
  name: string;

  @ApiProperty({ description: '맡은 역할' })
  @Column()
  role: string;

  constructor(partial: Partial<TeamsEntity>) {
    super();
    Object.assign(this, partial);
  }
}
