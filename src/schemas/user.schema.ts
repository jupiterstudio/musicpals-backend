// schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  auth0Id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: Date.now })
  joinDate: Date;

  @Prop({ default: 0 })
  totalPoints: number;

  @Prop({ default: 'Beginner Musician' })
  rank: string;

  @Prop({ default: Date.now })
  lastActivity: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
