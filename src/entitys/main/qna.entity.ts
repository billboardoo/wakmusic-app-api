import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'qna' })
export class QnaEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  category: string;

  @ApiProperty()
  @Column({ unique: true })
  question: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty({ description: 'timestamp 형식' })
  @Column()
  create_at: number;
}
