import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'artists' })
export class ArtistsEntity extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  artist: string;

  @Column()
  ids: string;

  constructor(partial: Partial<ArtistsEntity>) {
    super();
    Object.assign(this, partial);
  }
}
