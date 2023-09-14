import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { from, mergeMap } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  login(username: string, password: string) {
    return this.userService.validateUser(username, password).pipe(
      mergeMap((user) => {
        const payload = {
          sub: user.id,
          username: user.username,
          name: user.person.name,
          surname: user.person.surname,
          email: user.email,
        };
        return from(this.jwtService.signAsync(payload));
      }),
    );
  }
}
