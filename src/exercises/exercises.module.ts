import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ExerciseCompletion,
  ExerciseCompletionSchema,
} from '../schemas/exercise-completion.schema';
import { UsersModule } from '../users/users.module';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';
import { ProgressModule } from '../progress/progress.module';
import { AchievementTrackerModule } from '../achievement-tracker/achievement-tracker.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExerciseCompletion.name, schema: ExerciseCompletionSchema },
    ]),
    UsersModule,
    AchievementTrackerModule,
    ProgressModule,
  ],
  controllers: [ExercisesController],
  providers: [ExercisesService],
  exports: [ExercisesService],
})
export class ExercisesModule {}
