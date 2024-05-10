import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto) {
    return this.wishRepository.save(createWishDto);
  }

  async getTop() {
    return this.wishRepository.find({ order: { id: 'ASC' }, take: 1 });
  }

  async getLast() {
    return this.wishRepository.find({ order: { id: 'DESC' }, take: 1 });
  }

  async getById(id: number) {
    return this.wishRepository.findOneBy({ id });
  }

  async updateById(id: number, updateWishDto: UpdateWishDto) {
    return this.wishRepository.update({ id }, updateWishDto);
  }

  async deleteById(id: number) {
    return this.wishRepository.delete({ id });
  }

  async copy(id: number, updateWishDto: UpdateWishDto) {
    return await this.wishRepository.update(
      { id },
      { copied: () => 'copied + 1' },
    );
  }
}
