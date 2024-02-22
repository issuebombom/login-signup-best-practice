import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { BusinessException } from 'src/exception/BusinessException';
import { HttpStatus, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<Partial<User>> {
    const { email } = dto;
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user) {
      throw new BusinessException(
        'user',
        `${email} already exists`,
        `${email} 계정이 이미 존재합니다.`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await argon2.hash(dto.password);
    const createdUser = await this.userRepository.save({
      ...dto,
      password: hashedPassword,
    });

    const keysToKeep = ['id', 'name', 'email'];
    const filteredUser = Object.fromEntries(
      Object.entries(createdUser).filter(([key]) => keysToKeep.includes(key)),
    );
    return filteredUser;
  }
}
