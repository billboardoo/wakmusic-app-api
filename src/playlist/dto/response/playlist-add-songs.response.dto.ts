import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';
import { SuccessDto } from 'src/core/dto/success.dto';

export class PlaylistAddSongsResponseDto extends SuccessDto {
  @ApiProperty()
  @IsNumber()
  added_songs_length: number;

  @ApiProperty()
  @IsBoolean()
  duplicated: boolean;
}
