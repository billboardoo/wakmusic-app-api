import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entitys/user/user.entity';
import { Repository } from 'typeorm';
import { SetProfileBodyDto } from './dto/body/set-profile.body.dto';

export interface OAuthUser {
  provider: string;
  providerId: string;
  email: string;
  name: string;
}

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
  async findByProviderIdOrSave(googleUser: OAuthUser): Promise<UserEntity> {
    const { providerId, provider } = googleUser;

    const user = await this.userRepository.findOne({
      where: {
        id: providerId,
        platform: provider,
      },
    });

    if (user) {
      return user;
    }

    const newUser = this.userRepository.create();
    newUser.id = providerId;
    newUser.platform = provider;

    return await this.userRepository.save(newUser);
  }

  async setProfile(body: SetProfileBodyDto): Promise<UserEntity> {
    const user = await this.findOneById(body.clientId);

    user.profile = body.image;

    return await this.userRepository.save(user);
  }
}
