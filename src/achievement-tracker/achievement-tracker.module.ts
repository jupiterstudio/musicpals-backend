// src/tracker/tracker.module.ts
import { Module } from '@nestjs/common';
import { AchievementTrackerService } from './achievement-tracker.service';
import { UsersModule } from '../users/users.module';
import { AchievementsModule } from '../achievements/achievements.module';

@Module({
  imports: [UsersModule, AchievementsModule],
  providers: [AchievementTrackerService],
  exports: [AchievementTrackerService],
})
export class AchievementTrackerModule {}
