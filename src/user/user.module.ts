import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entitys/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity], 'user')],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
