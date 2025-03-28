// src/exercises/exercises.service.ts - Updated
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ExerciseCompletion,
  ExerciseCompletionDocument,
} from '../schemas/exercise-completion.schema';
import { UsersService } from '../users/users.service';
import { ProgressService } from '../progress/progress.service';
import { ModuleType } from '../utils/types';
import { AchievementTrackerService } from '../achievement-tracker/achievement-tracker.service';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectModel(ExerciseCompletion.name)
    private exerciseModel: Model<ExerciseCompletionDocument>,
    private usersService: UsersService,
    private achievementTracker: AchievementTrackerService,
    private progressService: ProgressService,
  ) {}

  async findByUserId(userId: string): Promise<ExerciseCompletion[]> {
    return this.exerciseModel
      .find({ userId })
      .sort({ completedDate: -1 })
      .exec();
  }

  async findByUserIdAndModule(
    userId: string,
    moduleType: string,
  ): Promise<ExerciseCompletion[]> {
    return this.exerciseModel
      .find({
        userId,
        moduleType,
      })
      .sort({ completedDate: -1 })
      .exec();
  }

  async recordCompletion(
    userId: string,
    moduleType: ModuleType,
    exerciseId: string,
    exerciseName: string,
    score: number,
    difficulty: string,
  ): Promise<ExerciseCompletion> {
    // Calculate points based on difficulty and score
    const basePoints = this.calculateBasePoints(difficulty);
    const accuracyBonus = this.calculateAccuracyBonus(score);
    const totalPoints = basePoints + accuracyBonus;

    // Create exercise completion record
    const exerciseCompletion = new this.exerciseModel({
      userId,
      moduleType,
      exerciseId,
      exerciseName,
      score,
      pointsEarned: totalPoints,
      difficulty,
      completedDate: new Date(),
    });

    // Save the record
    await exerciseCompletion.save();

    // Update user points
    await this.usersService.updatePoints(userId, totalPoints);

    // Update module progress
    await this.updateModuleProgress(userId, moduleType);

    // Get data needed for achievement tracking
    const exercises = await this.findByUserId(userId);
    const moduleExercises = exercises.filter(
      (ex) => ex.moduleType === moduleType,
    );
    const uniqueModules = [
      ...new Set(exercises.map((ex) => ex.moduleType)),
    ] as ModuleType[];

    // Check for achievements with collected data
    await this.achievementTracker.checkExerciseAchievements(
      userId,
      moduleType,
      score,
      difficulty,
      moduleExercises.length,
      uniqueModules,
    );

    // Check for rank-based achievements
    await this.achievementTracker.checkRankAchievements(userId);

    return exerciseCompletion;
  }

  /**
   * Update the user's progress for a specific module
   */
  private async updateModuleProgress(
    userId: string,
    moduleType: string,
  ): Promise<void> {
    // Get all exercises for this user and module
    const moduleExercises = await this.findByUserIdAndModule(
      userId,
      moduleType,
    );

    // Calculate progress based on exercises completed
    let progress = 0;

    if (moduleExercises.length > 0) {
      // For demonstration purposes, we'll use a simple formula:
      // - Progress increases as more exercises are completed (up to a maximum)
      // - Higher scores contribute more to progress

      // Calculate average score
      const totalScore = moduleExercises.reduce((sum, ex) => sum + ex.score, 0);
      const avgScore = totalScore / moduleExercises.length;

      // Calculate progress based on number of exercises and average score
      // Max 100% when 20+ exercises are completed with 100% average score
      const exerciseCount = Math.min(moduleExercises.length, 20) / 20; // 0.0 to 1.0
      const scoreMultiplier = avgScore / 100; // 0.0 to 1.0

      progress = Math.round(
        (exerciseCount * 0.7 + scoreMultiplier * 0.3) * 100,
      );
    }

    // Update progress in database
    await this.progressService.updateProgress(userId, moduleType, progress);
  }

  private calculateBasePoints(difficulty: string): number {
    switch (difficulty) {
      case 'Hard':
        return 30;
      case 'Medium':
        return 20;
      case 'Easy':
        return 10;
      default:
        return 10;
    }
  }

  private calculateAccuracyBonus(score: number): number {
    if (score >= 90) return 10;
    if (score >= 80) return 5;
    if (score >= 70) return 2;
    return 0;
  }
}
