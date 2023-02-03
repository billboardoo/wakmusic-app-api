import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

@Entity('user')
export class UserEntity extends BaseEntity {
  @ApiProperty({ description: '유저 고유 id' })
  @PrimaryColumn({ unique: true })
  id: string;

  @ApiProperty({ description: '로그인 플랫폼' })
  @Column()
  platform: string;

  @ApiProperty({ description: '프로필 타입', nullable: true })
  @Transform(({ value }) => (value ? value : 'panchi'))
  @Column()
  profile: string;

  @ApiProperty({ description: 'oauth 표시 이름' })
  @Column()
  displayName: string;

  @ApiProperty({ description: '처음 로그인 시간 (datetime)' })
  @Column()
  first_login_time: number;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
