import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { SetProfileBodyDto } from './dto/body/set-profile.body.dto';
import { UserEntity } from '../entitys/user/user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '프로필 설정',
    description: '프로필을 설정합니다.',
  })
  @Post('/profile/set')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async setProfile(@Body() body: SetProfileBodyDto) {
    const user = await this.userService.setProfile(body);
    if (!user) throw new NotFoundException();
  }
}
