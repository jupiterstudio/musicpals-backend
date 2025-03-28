// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(auth0Id: string): Promise<User> {
    const user = await this.userModel.findOne({ auth0Id }).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${auth0Id} not found`);
    }
    return user;
  }

  async findByAuth0Id(auth0Id: string): Promise<User> {
    const user = await this.userModel.findOne({ auth0Id }).exec();
    if (!user) {
      throw new NotFoundException(`User with Auth0 ID ${auth0Id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async create(userData: Partial<User>): Promise<User> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async update(auth0Id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.userModel
      .findOneAndUpdate({ auth0Id }, updateData, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${auth0Id} not found`);
    }
    return user;
  }

  async updatePoints(userId: string, pointsToAdd: number): Promise<User> {
    const user = await this.userModel.findOne({ auth0Id: userId }).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.totalPoints += pointsToAdd;
    user.rank = this.calculateRank(user.totalPoints);
    user.lastActivity = new Date();

    return user.save();
  }

  calculateRank(points: number): string {
    if (points >= 5001) return 'Master Musician';
    if (points >= 3501) return 'Expert Musician';
    if (points >= 2001) return 'Advanced Musician';
    if (points >= 1001) return 'Intermediate Musician';
    if (points >= 501) return 'Novice Musician';
    return 'Beginner Musician';
  }
}
