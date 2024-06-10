import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@Req() req: any, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(req.user, createWishlistDto);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne({
      where: { id },
      relations: ['items'],
    });
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(req.user, id, updateWishlistDto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: number) {
    return this.wishlistsService.remove(req.user, id);
  }
}
