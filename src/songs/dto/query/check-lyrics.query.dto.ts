import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckLyricsQueryDto {
  @ApiProperty({ description: '음악 id' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
