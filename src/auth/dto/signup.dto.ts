import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  public username: string;

  @IsString()
  public about: string;

  @IsString()
  public avatar: string;

  @IsEmail()
  public email: string;

  @MinLength(2)
  public password: string;
}
