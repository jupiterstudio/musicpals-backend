// schemas/exercise-completion.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ModuleType } from '../utils/types';

export type ExerciseCompletionDocument = ExerciseCompletion & Document;

@Schema()
export class ExerciseCompletion {
  @Prop({ required: true })
  userId: string;

  @Prop({
    required: true,
    enum: Object.values(ModuleType), // This is the key part - provide enum values for validation
    type: String, // The underlying type is String
  })
  moduleType: ModuleType;

  @Prop({ required: true })
  exerciseId: string;

  @Prop({ required: true })
  exerciseName: string;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  pointsEarned: number;

  @Prop({ required: true, enum: ['Easy', 'Medium', 'Hard'] })
  difficulty: string;

  @Prop({ default: Date.now })
  completedDate: Date;
}

export const ExerciseCompletionSchema =
  SchemaFactory.createForClass(ExerciseCompletion);
