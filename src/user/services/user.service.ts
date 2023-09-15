import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Observable, catchError, from, map, mergeMap } from 'rxjs';
import { RegisterUserDto } from '../models/dto/register-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../models/schema/user.schema';
import { Model, mongo } from 'mongoose';
import { AddressType } from '../models/enum/address-type.enum';
import { ApiException } from '../../exception-handler/api-exception';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  private hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 10));
  }

  private comparePassword(
    attempt: string,
    passwordHash: string,
  ): Observable<boolean> {
    return from(bcrypt.compare(attempt, passwordHash));
  }

  private findUserByUserName(username: string): Observable<UserDocument> {
    return from(this.userModel.findOne({ username }).exec());
  }

  private findUserByUserNameWithPassword(
    username: string,
  ): Observable<UserDocument> {
    return from(
      this.userModel.findOne({ username }).select('+password').exec(),
    );
  }

  public registerUser(data: RegisterUserDto): Observable<UserDocument> {
    return this.findUserByUserName(data.username).pipe(
      mergeMap((found) => {
        if (found) {
          throw new ApiException('USER_ALREADY_EXISTS');
        }
        const user = new User();
        user.username = data.username;
        user.email = { emailAddress: data.email, verified: false };
        user.addresses = [];
        user.addresses.push({
          country: data.address?.country,
          city: data.address?.city,
          value: data.address?.value,
          type: AddressType.MAIN,
        });
        user.person = {
          name: data.name,
          surname: data.surname,
          pid: data.pid,
          idCardPhotoFileId: null,
          birthDate: data.birthdate,
        };
        return this.hashPassword(data.password).pipe(
          mergeMap((hashedPassword) => {
            user.password = hashedPassword;
            return from(this.userModel.create(user)).pipe(
              catchError((error: Error) => {
                if (
                  error instanceof mongo.MongoServerError &&
                  error.code === 11000
                ) {
                  const { keyPattern } = error;
                  throw new ApiException(
                    'DUBLICATE_KEY_ERROR',
                    Object.keys(keyPattern) + ' is dublicated',
                  );
                }
                throw error;
              }),
            );
          }),
        );
      }),
    );
  }

  public validateUser(
    username: string,
    password: string,
  ): Observable<UserDocument> {
    return this.findUserByUserNameWithPassword(username).pipe(
      mergeMap((user) => {
        if (!user) {
          throw new ApiException('USERNAME_OR_PASSWORD_INCORRECT');
        }
        return this.comparePassword(password, user.password).pipe(
          map((valid) => {
            if (valid) {
              return user;
            }
            throw new ApiException('USERNAME_OR_PASSWORD_INCORRECT');
          }),
        );
      }),
    );
  }

  public changePassword(
    username: string,
    oldPassword: string,
    newPassword: string,
  ): Observable<UserDocument> {
    return this.validateUser(username, oldPassword).pipe(
      mergeMap((user) => {
        return this.hashPassword(newPassword).pipe(
          mergeMap((passwordHash) => {
            return from(
              this.userModel
                .findOneAndUpdate(
                  { username: user.username },
                  { $set: { password: passwordHash } },
                  { new: true },
                )
                .exec(),
            );
          }),
        );
      }),
    );
  }
}
