import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private dataSource: DataSource,
  ) {}

  async create(user: User, createWishDto: CreateWishDto) {
    return this.wishRepository.save({
      ...createWishDto,
      owner: user,
    });
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

  async findOne(query: FindManyOptions<Wish>) {
    const wish = await this.wishRepository.findOne(query);
    if (!wish) throw new NotFoundException('Wish not found');
    return wish;
  }

  async findMany(query: FindManyOptions<Wish>) {
    const wishes = await this.wishRepository.find(query);

    if (!wishes) throw new NotFoundException('Wish not found');
    return wishes;
  }

  async updateById(user: User, id: number, updateWishDto: UpdateWishDto) {
    try {
      const wish = await this.wishRepository.findOne({ where: { id } });
      if (wish || wish.owner.id === user.id)
        return this.wishRepository.update({ id }, updateWishDto);
    } catch {
      throw new NotFoundException('Wish not found');
    }
  }

  async deleteById(user: User, id: number) {
    try {
      const wish = await this.wishRepository.findOne({ where: { id } });
      if (wish.owner.id === user.id) return this.wishRepository.delete({ id });
    } catch {
      throw new NotFoundException('Wish not found');
    }
  }

  async raise(id: number, offerSum: number) {
    const wish = await this.wishRepository.findOne({ where: { id } });
    if (!wish) throw new NotFoundException('Wish not found');

    return this.wishRepository.update(
      { id },
      { raised: wish.raised + offerSum },
    );
  }

  async copy(user: User, id: number) {
    const wish = await this.wishRepository.findOne({ where: { id } });
    if (!wish) throw new NotFoundException('Wish not found');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(
        Wish,
        { id },
        { copied: wish.copied + 1 },
      );
      const newWish = this.wishRepository.create({
        name: wish.name,
        link: wish.link,
        image: wish.image,
        price: wish.price,
        description: wish.description,
        owner: user,
        copied: 0,
        raised: 0,
      });
      await queryRunner.manager.save(newWish);
      await queryRunner.commitTransaction();
      return newWish;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new NotFoundException('Wish not copied');
    } finally {
      await queryRunner.release();
    }
  }
}
