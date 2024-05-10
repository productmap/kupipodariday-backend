import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(user: SignInDto) {
    return { access_token: this.jwtService.sign(user) };
  }

  async signUp(user: SignUpDto) {
    const existingUser = this.usersService.findByUsername(user.username);

    if (existingUser) {
      throw new BadRequestException('username already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = { ...user, password: hashedPassword };

    await this.usersService.create(newUser);

    return this.signIn(newUser);
  }
}
