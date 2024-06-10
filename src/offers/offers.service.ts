import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async createOffer(user: User, createOfferDto: CreateOfferDto) {
    const wish = await this.wishesService.findOne({
      where: { id: createOfferDto.itemId },
      relations: ['owner'],
    });

    if (!wish || wish.owner.id === user.id) {
      throw new BadRequestException('You cant create an offer for this item');
    }

    await this.wishesService.raise(wish.id, createOfferDto.amount);
    return this.offersRepository.save({
      item: wish,
      user,
      amount: createOfferDto.amount,
    });
  }

  async findAll() {
    return this.offersRepository.find({
      relations: ['item', 'user'],
    });
  }

  async findOne(id: number) {
    return this.offersRepository.findOne({
      where: { id },
      relations: ['item', 'user'],
    });
  }
}
