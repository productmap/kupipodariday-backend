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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  create(@Req() req: any, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(req.user, createWishDto);
  }

  @Get('top')
  getTop() {
    return this.wishesService.getTop();
  }

  @Get('last')
  getLast() {
    return this.wishesService.getLast();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.wishesService.getById(+id);
  }

  @Patch(':id')
  updateOne(
    @Req() req: any,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.updateById(req.user, id, updateWishDto);
  }

  @Delete(':id')
  deleteOne(@Req() req: any, @Param('id') id: number) {
    return this.wishesService.deleteById(req.user, id);
  }

  @Post(':id/copy')
  copy(@Req() req: any, @Param('id') id: number) {
    return this.wishesService.copy(req.user, id);
  }
}
