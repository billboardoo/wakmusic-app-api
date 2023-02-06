import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entitys/user/user.entity';
import { Repository } from 'typeorm';
import { SetProfileBodyDto } from './dto/body/set-profile.body.dto';
import { OauthDto } from '../auth/dto/oauth.dto';
import { first } from 'rxjs';
import { JwtPayload } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity, 'user')
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOneById(id: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  async findByProviderIdOrSave(OAuthUser: OauthDto): Promise<UserEntity> {
    let user = await this.userRepository.findOne({
      where: {
        id: OAuthUser.id,
        platform: OAuthUser.provider,
      },
    });

    if (!user) user = await this.create(OAuthUser);

    if (!(user.displayName == OAuthUser.displayName)) {
      user = await this.updateUser(user, OAuthUser);
    }

    return user;
  }

  async create(OAuthUser: OauthDto): Promise<UserEntity> {
    const newUser = this.userRepository.create();
    newUser.id = OAuthUser.id;
    newUser.platform = OAuthUser.provider;
    newUser.profile = 'panchi';
    newUser.first_login_time = Date.now();

    const user = await this.userRepository.save(newUser);
    if (!user) throw new InternalServerErrorException();

    return user;
  }

  async updateUser(user: UserEntity, OAuthData: OauthDto): Promise<UserEntity> {
    user.displayName = OAuthData.displayName;

    const updatedUser = await this.userRepository.save(user);
    if (!updatedUser) throw new InternalServerErrorException();

    return updatedUser;
  }

  async setProfile(body: SetProfileBodyDto): Promise<UserEntity> {
    const user = await this.findOneById(body.clientId);

    user.profile = body.image;

    return await this.userRepository.save(user);
  }

  checkFirstLogin(first_login_time: number): boolean {
    const now = new Date();
    const first_login = new Date(first_login_time);

    return now.toDateString() == first_login.toDateString();
  }

  async remove(user: JwtPayload): Promise<boolean> {
    const targetUser = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
    });
    if (!targetUser) throw new NotFoundException('유저가 없습니다.');

    const removedUser = await this.userRepository.remove(targetUser);

    return true;
  }
}
