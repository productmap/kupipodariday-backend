import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  create(@Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto);
  }

  @Get()
  getTop() {
    return this.wishesService.getTop();
  }

  @Get()
  getLast() {
    return this.wishesService.getLast();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.wishesService.getById(+id);
  }

  @Patch(':id')
  updateById(@Param('id') id: number, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.updateById(+id, updateWishDto);
  }

  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.wishesService.deleteById(+id);
  }

  @Post(':id/copy')
  copy(@Param('id') id: number, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.copy(+id, updateWishDto);
  }
}
