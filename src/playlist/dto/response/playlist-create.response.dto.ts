import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SuccessDto } from 'src/core/dto/success.dto';

export class PlaylistCreateResponseDto extends SuccessDto {
  @ApiProperty({ description: '플레이리스트 고유 key' })
  @IsString()
  @IsNotEmpty()
  key: string;
}
