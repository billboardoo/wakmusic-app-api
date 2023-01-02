import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

const teamType = ['website', 'ios', 'android', 'special', 'news'] as const;
type TeamType = typeof teamType[number];

@Entity({ name: 'teams' })
export class TeamsEntity extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '소속팀' })
  @Column({
    type: 'enum',
    enum: teamType,
  })
  team: TeamType;

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
