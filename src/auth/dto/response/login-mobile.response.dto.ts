import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginMobileResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}
