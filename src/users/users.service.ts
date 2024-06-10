import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async validateUser(username: string, password: string) {
    const user: User = await this.usersRepository.findOneBy({ username });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isMatch: boolean = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.save(createUserDto);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByUsername(findUserDto: FindUsersDto) {
    return await this.usersRepository.findOne({
      where: [{ username: findUserDto.query }, { email: findUserDto.query }],
    });
  }

  async findUserWishes(query: FindOptionsWhere<User>) {
    return this.usersRepository.find({
      where: query,
      select: ['wishes'],
      relations: ['wishes'],
    });
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    const existingUser = await this.usersRepository.findOneBy({ id });

    if (!existingUser) {
      throw new BadRequestException('User not found');
    }

    if (
      updateUserDto.username &&
      (await this.usersRepository.findOneBy({
        username: updateUserDto.username,
      }))
    ) {
      throw new BadRequestException(
        'Пользователь с таким именем уже существует',
      );
    }

    if (
      updateUserDto.email &&
      (await this.usersRepository.findOneBy({ email: updateUserDto.email }))
    ) {
      throw new BadRequestException('Email already exists');
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    return this.usersRepository.update(id, updateUserDto);
  }
}
