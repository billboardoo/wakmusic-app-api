import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetProfileBodyDto {
  @ApiProperty({ description: '프로필 타입' })
  @IsString()
  @IsNotEmpty()
  image: string;
}
