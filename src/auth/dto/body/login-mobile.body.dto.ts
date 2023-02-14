import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class LoginMobileBodyDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['google', 'naver', 'apple'])
  provider: 'google' | 'naver' | 'apple';
}
