import { IsNotEmpty, IsString } from 'class-validator';
import { IsNotSameAs } from '../../../custom-validators/is-not-same.function';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  oldPassword: string;
  @IsString()
  @IsNotEmpty()
  @IsNotSameAs('oldPassword')
  newPassword: string;
}
