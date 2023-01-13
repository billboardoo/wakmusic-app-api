import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export const newSongsGroups = ['all', 'woowakgood', 'isedol', 'gomem'];
export class FindNewSongsParamDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(newSongsGroups)
  group: string;
}
