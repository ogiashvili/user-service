import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Person } from './person.schema';
import { HydratedDocument } from 'mongoose';
import { Email, EmailSchema } from './email.schema';
import { Address, AddressSchema } from './address.schema';

@Schema({ collection: 'users' })
export class User {
  @Prop({ required: true, type: String, unique: true })
  public username: string;

  @Prop({ required: false, type: Person })
  public person: Person;

  @Prop({ required: false, type: EmailSchema })
  public email: Email;

  @Prop({ required: false, type: [AddressSchema] })
  public addresses: Address[];

  @Prop({ required: true, type: String, select: false })
  public password: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
