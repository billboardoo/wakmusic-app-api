import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'manager' })
export class LikeManagerEntity extends BaseEntity {
  @ApiProperty({ description: '고유 id' })
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '유저 id' })
  @Column({ type: 'text', nullable: false })
  user_id: string;

  @ApiProperty()
  @Column('simple-array')
  songs: Array<string>;
}
