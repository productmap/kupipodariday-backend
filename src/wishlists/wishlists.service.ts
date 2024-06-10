import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, In, Repository } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async create(user: User, createWishlistDto: CreateWishlistDto) {
    const wishes = await this.wishesService.findMany({
      where: { id: In(createWishlistDto.itemsId) },
    });

    return this.wishlistsRepository.save({
      ...createWishlistDto,
      owner: user,
      items: wishes,
    });
  }

  async findAll() {
    return this.wishlistsRepository.find({ relations: ['owner', 'items'] });
  }

  async findOne(id: FindOneOptions<Wishlist>) {
    if (!id) {
      throw new NotFoundException(`Could not find wishlist`);
    }

    try {
      return await this.wishlistsRepository.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundException(`Could not find wishlist`);
    }
  }

  async update(user: User, id: number, updateWishlistDto: UpdateWishlistDto) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: {
        id,
      },
      relations: ['owner'],
    });

    if (!wishlist || wishlist.owner.id !== user.id) {
      throw new NotFoundException(
        `Could not find wishlist or you can't update other's wishlists`,
      );
    }

    return await this.wishlistsRepository.save({
      ...wishlist,
      ...updateWishlistDto,
    });
  }

  async remove(user: User, id: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: {
        id,
      },
      relations: ['owner'],
    });

    if (!wishlist || wishlist.owner.id !== user.id) {
      throw new NotFoundException(
        `Could not find wishlist or you can't delete other's wishlists`,
      );
    }

    return await this.wishlistsRepository.remove(wishlist);
  }
}
