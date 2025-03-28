import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { ExerciseDifficulty, ModuleType } from '../../utils/types';

export class RecordExerciseDto {
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @IsNotEmpty()
  @IsEnum(ModuleType)
  readonly moduleType: ModuleType;

  @IsNotEmpty()
  @IsString()
  readonly exerciseId: string;

  @IsNotEmpty()
  @IsString()
  readonly exerciseName: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  readonly score: number;

  @IsNotEmpty()
  @IsEnum(ExerciseDifficulty)
  readonly difficulty: ExerciseDifficulty;
}
