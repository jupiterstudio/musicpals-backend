// schemas/progress.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProgressDocument = Progress & Document;

@Schema()
export class Progress {
  @Prop({ required: true })
  userId: string;

  @Prop({
    required: true,
    enum: ['EarTraining', 'SightSinging', 'MusicGeneration', 'Lessons'],
  })
  moduleType: string;

  @Prop({ required: true, min: 0, max: 100 })
  progress: number;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
