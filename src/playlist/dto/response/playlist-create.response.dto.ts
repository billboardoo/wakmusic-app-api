import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlaylistCreateResponseDto {
  @ApiProperty({ description: '플레이리스트 고유 key' })
  @IsString()
  @IsNotEmpty()
  key: string;
}
