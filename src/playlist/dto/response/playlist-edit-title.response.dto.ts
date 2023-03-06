import { SuccessDto } from '../../../core/dto/success.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PlaylistEditTitleResponseDto extends SuccessDto {
  @ApiProperty()
  @IsString()
  title: string;
}
