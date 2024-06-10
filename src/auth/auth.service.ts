import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(signInDto: SignInDto) {
    if (!signInDto.username && !signInDto.password) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }

    const user = await this.usersService.findByUsername({
      query: signInDto.username,
    });

    if (!user) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }

    const isValidPassword = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('auth.secret'),
      }),
    };
  }

  async signUp(user: SignUpDto) {
    try {
      if (!user) throw new BadRequestException('Некорректный запрос');

      const existingUser = await this.usersService.findByUsername({
        query: user.username,
      });

      if (existingUser) {
        throw new BadRequestException(
          'Пользователь с таким email или username уже зарегистрирован',
        );
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(user.password, salt);
      const newUser = { ...user, password: hashedPassword };

      return await this.usersService.create(newUser);
    } catch (error) {
      throw new BadRequestException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    }
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    const user = await this.usersService.findByUsername({
      query: payload.username,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
