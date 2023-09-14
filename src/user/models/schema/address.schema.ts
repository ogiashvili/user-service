import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AddressType } from '../enum/address-type.enum';

@Schema({ _id: false })
export class Address {
  @Prop({ required: true, type: String, enum: AddressType })
  public type: AddressType;
  @Prop({ required: false, type: String })
  public country: string;
  @Prop({ required: false, type: String })
  public city: string;
  @Prop({ required: false, type: String })
  public value: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
