/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/progress/progress.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress, ProgressDocument } from '../schemas/progress.schema';
import {
  ExerciseCompletion,
  ExerciseCompletionDocument,
} from '../schemas/exercise-completion.schema';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>,
    @InjectModel(ExerciseCompletion.name)
    private exerciseModel: Model<ExerciseCompletionDocument>,
  ) {}

  async findByUserId(userId: string): Promise<Progress[]> {
    return this.progressModel.find({ userId }).exec();
  }

  async findDetailedProgressByUserId(userId: string): Promise<any[]> {
    // Get all progress records for the user
    const progressRecords = await this.progressModel.find({ userId }).exec();

    // Get all exercises completed by the user
    const exercises = await this.exerciseModel.find({ userId }).exec();

    // Group exercises by module type
    const exercisesByModule = exercises.reduce((acc, exercise) => {
      if (!acc[exercise.moduleType]) {
        acc[exercise.moduleType] = [];
      }
      acc[exercise.moduleType].push({
        id: exercise.exerciseId,
        name: exercise.exerciseName,
        score: exercise.score,
        completedDate: exercise.completedDate,
      });
      return acc;
    }, {});

    // Combine progress with exercises
    return progressRecords.map((progress) => ({
      moduleType: progress.moduleType,
      progress: progress.progress,
      lastUpdated: progress.lastUpdated,
      exercises: exercisesByModule[progress.moduleType] || [],
    }));
  }

  async findByUserIdAndModule(
    userId: string,
    moduleType: string,
  ): Promise<Progress> {
    const progress = await this.progressModel
      .findOne({
        userId,
        moduleType,
      })
      .exec();

    if (!progress) {
      throw new Error(
        `Progress not found for userId: ${userId} and moduleType: ${moduleType}`,
      );
    }

    return progress;
  }

  async updateProgress(
    userId: string,
    moduleType: string,
    progress: number,
  ): Promise<Progress> {
    // Find the progress record or create if it doesn't exist
    let progressRecord = await this.progressModel.findOne({
      userId,
      moduleType,
    });

    if (!progressRecord) {
      progressRecord = new this.progressModel({
        userId,
        moduleType,
        progress: 0,
      });
    }

    // Update the progress
    progressRecord.progress = progress;
    progressRecord.lastUpdated = new Date();

    return progressRecord.save();
  }
}
