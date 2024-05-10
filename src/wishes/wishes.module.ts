import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WishesService } from './wishes.service';
import { UsersService } from '../users/users.service';

import { WishesController } from './wishes.controller';

import { User } from '../users/entities/user.entity';
import { Wish } from './entities/wish.entity';
import { Offer } from '../offers/entities/offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish, Offer])],
  controllers: [WishesController],
  providers: [WishesService, UsersService],
  exports: [WishesService],
})
export class WishesModule {}
