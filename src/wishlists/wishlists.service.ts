import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Wishlist } from './entities/wishlist.entity';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
  ) {}
  async create(createWishlistDto: CreateWishlistDto) {
    return 'This action adds a new wishlistlist';
  }

  async findAll() {
    const wishlists = await this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async findOne(id: number) {
    return `This action returns a #${id} wishlistlist`;
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return `This action updates a #${id} wishlistlist`;
  }

  async remove(id: number) {
    return `This action removes a #${id} wishlistlist`;
  }
}
