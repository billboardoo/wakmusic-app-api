import { IsNotEmpty, IsString } from 'class-validator';

export class LoginMobileResponseDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
