/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProgressModule } from './progress/progress.module';
import { ExercisesModule } from './exercises/exercises.module';
import { AchievementsModule } from './achievements/achievements.module';
import { MongodbModule } from './mongodb/mongodb.module';
import { MongodbService } from './mongodb/mongodb.service';
import { AchievementTrackerModule } from './achievement-tracker/achievement-tracker.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [MongodbModule],
      useExisting: MongodbService,
    }),
    AuthModule,
    UsersModule,
    ProgressModule,
    ExercisesModule,
    AchievementsModule,
    AchievementTrackerModule,
  ],
})
export class AppModule {}
