// src/achievements/achievements.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Achievement,
  AchievementDocument,
} from '../schemas/achievement.schema';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectModel(Achievement.name)
    private achievementModel: Model<AchievementDocument>,
  ) {}

  async findByUserId(userId: string): Promise<Achievement[]> {
    return this.achievementModel
      .find({ userId })
      .sort({ unlockedDate: -1 })
      .exec();
  }

  async unlockAchievement(
    userId: string,
    name: string,
    description: string,
    icon: string,
  ): Promise<Achievement> {
    // Check if achievement already exists for user
    const existing = await this.achievementModel.findOne({
      userId,
      name,
    });

    if (existing) {
      return existing;
    }

    // Create new achievement
    const achievement = new this.achievementModel({
      userId,
      name,
      description,
      icon,
      unlockedDate: new Date(),
    });

    return achievement.save();
  }
}
