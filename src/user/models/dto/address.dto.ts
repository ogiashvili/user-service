import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddressDto {
  @IsString()
  @IsOptional()
  country: string;
  @IsString()
  @IsOptional()
  city: string;
  @IsString()
  @IsNotEmpty()
  value: string;
}
