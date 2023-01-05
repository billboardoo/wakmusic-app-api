import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class UserEntity extends BaseEntity {
  @ApiProperty({ description: '유저 고유 id' })
  @PrimaryColumn({ unique: true })
  id: string;

  @ApiProperty({ description: '로그인 플랫폼' })
  @Column()
  platform: string;

  @ApiProperty({ description: '프로필 타입', nullable: true })
  @Column()
  profile: string;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
