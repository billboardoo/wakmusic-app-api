import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'updated' })
export class UpdatedEntity extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  time: number;

  constructor(partial: Partial<UpdatedEntity>) {
    super();
    Object.assign(this, partial);
  }
}
