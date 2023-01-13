import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export const newSongsGroups = ['all', 'woowakgood', 'isedol', 'gomem'];
export class FindNewSongsParamDto {
  @ApiProperty({ description: `그룹 목록 : ${newSongsGroups.join(', ')}` })
  @IsString()
  @IsNotEmpty()
  @IsIn(newSongsGroups)
  group: string;
}
