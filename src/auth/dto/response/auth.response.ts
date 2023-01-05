import { Express } from 'express';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AuthResponse implements Express.User {
  @IsString()
  @IsOptional()
  profile?: string;

  @IsNumber()
  status: number;
}
