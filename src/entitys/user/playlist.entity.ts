import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('playlist')
export class PlaylistEntity extends BaseEntity {
  @PrimaryColumn()
  key: string;

  @Column()
  title: string;

  @Column()
  creator: string;

  @Column()
  platform: string;

  @Column()
  image: string;

  @Column()
  songlist: string;

  @Column()
  public: string;

  @Column()
  clientId: string;

  @Column()
  subscribe: string;

  constructor(partial: Partial<PlaylistEntity>) {
    super();
    Object.assign(this, partial);
  }
}
