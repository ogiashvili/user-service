import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from './address.dto';
import { Type } from 'class-transformer';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsOptional()
  surname: string;

  @IsNumberString()
  @IsOptional()
  @Length(11)
  pid: string;

  @IsDate()
  @IsOptional()
  birthdate: Date;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
