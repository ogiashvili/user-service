import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class Person {
  @Prop({ required: true, type: String })
  public name: string;

  @Prop({ required: true, type: String })
  public surname: string;

  @Prop({ required: true, type: String, unique: true })
  public pid: string;

  @Prop({ required: false, type: String })
  public idCardPhotoFileId: string;

  @Prop({ required: false, type: Date })
  public birthDate: Date;
}
