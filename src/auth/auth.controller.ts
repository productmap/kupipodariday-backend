import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
// import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/signin.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    // private usersService: UsersService,
  ) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const user = await this.authService.signUp(createUserDto);
      res.status(HttpStatus.CREATED).send(user);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send({ message: error.message });
    }
    // const user = await this.usersService.create(createUserDto);
    // return this.authService.signUp(user);
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
