import { IsInt, IsString, Length } from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsString()
  link: string;

  @IsString()
  image: string;

  @IsInt()
  price: number;

  @IsString()
  @Length(1, 1024)
  description: string;
}
