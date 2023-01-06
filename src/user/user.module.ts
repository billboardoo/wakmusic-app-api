import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entitys/user/user.entity';
import { PlaylistEntity } from '../entitys/user/playlist.entity';
import { PlaylistModule } from '../playlist/playlist.module';
import { PlaylistService } from '../playlist/playlist.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PlaylistEntity], 'user'),
    PlaylistModule,
  ],
  providers: [UserService, PlaylistService],
  controllers: [UserController],
})
export class UserModule {}
