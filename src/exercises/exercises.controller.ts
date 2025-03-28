import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExercisesService } from './exercises.service';
import { ExerciseCompletion } from '../schemas/exercise-completion.schema';
import { ModuleType } from '../utils/types';

@Controller('exercises')
@UseGuards(AuthGuard('jwt'))
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  async getUserExercises(@Req() req): Promise<ExerciseCompletion[]> {
    const userId = req.user.userId;
    return this.exercisesService.findByUserId(userId);
  }

  @Get(':moduleType')
  async getUserModuleExercises(
    @Req() req,
    @Param('moduleType') moduleType: string,
  ): Promise<ExerciseCompletion[]> {
    const userId = req.user.userId;
    return this.exercisesService.findByUserIdAndModule(userId, moduleType);
  }

  @Post('record')
  async recordExerciseCompletion(
    @Req() req,
    @Body('moduleType') moduleType: ModuleType,
    @Body('exerciseId') exerciseId: string,
    @Body('exerciseName') exerciseName: string,
    @Body('score') score: number,
    @Body('difficulty') difficulty: string,
  ): Promise<ExerciseCompletion> {
    const userId = req.user.userId;
    return this.exercisesService.recordCompletion(
      userId,
      moduleType,
      exerciseId,
      exerciseName,
      score,
      difficulty,
    );
  }
}
