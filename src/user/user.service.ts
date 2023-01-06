import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entitys/user/user.entity';
import { Repository } from 'typeorm';
import { SetProfileBodyDto } from './dto/body/set-profile.body.dto';

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
  async findByProviderIdOrSave(OAuthUser: any): Promise<UserEntity> {
    let userId: string;
    if (OAuthUser.provider == 'google') userId = OAuthUser.id;
    else if (OAuthUser.provider == 'naver') userId = OAuthUser._json.id;
    else if (OAuthUser.provider == 'apple') userId = OAuthUser.sub;

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        platform: OAuthUser.provider,
      },
    });

    if (user) {
      return user;
    }

    const newUser = this.userRepository.create();
    newUser.id = userId;
    newUser.platform = OAuthUser.provider;

    return await this.userRepository.save(newUser);
  }

  async setProfile(body: SetProfileBodyDto): Promise<UserEntity> {
    const user = await this.findOneById(body.clientId);

    user.profile = body.image;

    return await this.userRepository.save(user);
  }
}
