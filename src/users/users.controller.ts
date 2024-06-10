import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  async getMe(@Req() req) {
    return req.user;
  }

  @Patch('me')
  async updateMe(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOne(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  async getMyWishes(@Req() req: any) {
    return this.usersService.findUserWishes({ id: req.user.id });
  }

  @Get(':username')
  getUserByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername({
      query: username,
    });
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    const user = await this.usersService.findByUsername({
      query: username,
    });
    return this.usersService.findUserWishes(user);
  }

  @Post('find')
  async getUserByLogin(@Body() findUserDto: FindUsersDto) {
    return this.usersService.findByUsername(findUserDto);
  }
}
