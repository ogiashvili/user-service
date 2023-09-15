import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { RegisterUserDto } from '../models/dto/register-user.dto';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../models/dto/login.dto';
import { ChangePasswordDto } from '../models/dto/change-password.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  registerUser(@Body() body: RegisterUserDto) {
    return this.userService.registerUser(body);
  }

  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.username, body.password);
  }

  @Post('/password/change')
  changePassword(@Body() body: ChangePasswordDto) {
    return this.userService.changePassword(
      body.username,
      body.oldPassword,
      body.newPassword,
    );
  }
}
