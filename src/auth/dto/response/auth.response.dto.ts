import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class AuthResponseDto {
  @IsString()
  id: string;

  @IsString()
  platform: string;

  @IsString()
  displayName: string;

  @IsNumber()
  first_login_time: number;

  @IsBoolean()
  first: boolean;
}
