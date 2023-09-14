import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Email {
  @Prop({ required: true, type: String })
  public emailAddress: string;

  @Prop({ required: true, type: Boolean, default: false })
  public verified: boolean;
}

export const EmailSchema = SchemaFactory.createForClass(Email);
