/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/achievements/achievement-tracker.service.ts
import { Injectable } from '@nestjs/common';
import { AchievementsService } from '../achievements/achievements.service';
import { UsersService } from '../users/users.service';
import { ModuleType } from '../utils/types';

/**
 * Service for tracking and awarding achievements based on user activity
 */
@Injectable()
export class AchievementTrackerService {
  constructor(
    private achievementsService: AchievementsService,
    private usersService: UsersService,
  ) {}

  /**
   * Check for achievements when a user completes an exercise
   */
  async checkExerciseAchievements(
    userId: string,
    moduleType: ModuleType,
    score: number,
    difficulty: string,
    exercisesCount: number, // Pass this as a parameter instead of fetching exercises
    uniqueModules: ModuleType[], // Pass this as a parameter
  ): Promise<void> {
    // Check for "Perfect Score" achievement
    if (score >= 100) {
      await this.awardPerfectScore(userId, moduleType);
    }

    // Check for difficulty-based achievements
    if (difficulty === 'Hard' && score >= 80) {
      await this.awardHardExerciseMastery(userId, moduleType);
    }

    // Check for module completion achievements
    if (exercisesCount >= 10) {
      await this.awardModuleDedication(userId, moduleType);
    }

    // Check for versatility (completion across different modules)
    if (uniqueModules.length >= 3) {
      await this.awardVersatility(userId);
    }
  }

  /**
   * Award achievement for getting a perfect score
   */
  private async awardPerfectScore(
    userId: string,
    moduleType: ModuleType,
  ): Promise<void> {
    let name = 'Perfect Score';
    let description = 'Score 100% on any exercise';
    const icon = 'award';

    // Module-specific achievements
    if (moduleType === ModuleType.EAR_TRAINING) {
      name = 'Perfect Pitch';
      description = 'Score 100% on an Ear Training exercise';
    } else if (moduleType === ModuleType.SIGHT_SINGING) {
      name = 'Vocal Virtuoso';
      description = 'Score 100% on a Sight Singing exercise';
    } else if (moduleType === ModuleType.MUSIC_GENERATION) {
      name = 'Melody Master';
      description = 'Create a perfect melody';
    }

    await this.achievementsService.unlockAchievement(
      userId,
      name,
      description,
      icon,
    );
  }

  /**
   * Award achievement for mastering a hard exercise
   */
  private async awardHardExerciseMastery(
    userId: string,
    moduleType: ModuleType,
  ): Promise<void> {
    let name = 'Advanced Mastery';
    let description = 'Score 80% or higher on a Hard difficulty exercise';
    const icon = 'award';

    if (moduleType === ModuleType.EAR_TRAINING) {
      name = 'Ear Training Expert';
      description = 'Master a difficult ear training exercise';
    } else if (moduleType === ModuleType.SIGHT_SINGING) {
      name = 'Sight Singing Expert';
      description = 'Master a difficult sight singing exercise';
    }

    await this.achievementsService.unlockAchievement(
      userId,
      name,
      description,
      icon,
    );
  }

  /**
   * Award achievement for completing many exercises in a module
   */
  private async awardModuleDedication(
    userId: string,
    moduleType: ModuleType,
  ): Promise<void> {
    let name = 'Module Dedication';
    let description = 'Complete 10 exercises in the same module';
    const icon = 'music';

    if (moduleType === ModuleType.EAR_TRAINING) {
      name = 'Ear Training Enthusiast';
      description = 'Complete 10 ear training exercises';
    } else if (moduleType === ModuleType.SIGHT_SINGING) {
      name = 'Vocal Dedication';
      description = 'Complete 10 sight singing exercises';
    } else if (moduleType === ModuleType.MUSIC_GENERATION) {
      name = 'Composer';
      description = 'Create 10 melodies';
    } else if (moduleType === ModuleType.LESSONS) {
      name = 'Theory Scholar';
      description = 'Complete 10 music theory lessons';
    }

    await this.achievementsService.unlockAchievement(
      userId,
      name,
      description,
      icon,
    );
  }

  /**
   * Award achievement for using multiple modules
   */
  private async awardVersatility(userId: string): Promise<void> {
    const name = 'Musical Versatility';
    const description = 'Use at least 3 different modules';
    const icon = 'music';

    await this.achievementsService.unlockAchievement(
      userId,
      name,
      description,
      icon,
    );
  }

  /**
   * Check for rank-based achievements
   */
  async checkRankAchievements(userId: string): Promise<void> {
    const user = await this.usersService.findOne(userId);

    // Achievement based on user rank
    if (user.rank === 'Advanced Musician') {
      await this.achievementsService.unlockAchievement(
        userId,
        'Advanced Musician',
        'Reach the Advanced Musician rank',
        'award',
      );
    } else if (user.rank === 'Expert Musician') {
      await this.achievementsService.unlockAchievement(
        userId,
        'Expert Musician',
        'Reach the Expert Musician rank',
        'award',
      );
    } else if (user.rank === 'Master Musician') {
      await this.achievementsService.unlockAchievement(
        userId,
        'Master Musician',
        'Reach the Master Musician rank',
        'award',
      );
    }
  }
}
