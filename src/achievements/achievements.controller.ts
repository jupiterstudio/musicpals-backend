/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AchievementsService } from './achievements.service';
import { Achievement } from '../schemas/achievement.schema';

@Controller('achievements')
@UseGuards(AuthGuard('jwt'))
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  async getUserAchievements(@Req() req): Promise<Achievement[]> {
    const userId = req.user.userId;
    return this.achievementsService.findByUserId(userId);
  }

  @Post('unlock')
  async unlockAchievement(
    @Req() req,
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('icon') icon: string,
  ): Promise<Achievement> {
    const userId = req.user.userId;
    return this.achievementsService.unlockAchievement(
      userId,
      name,
      description,
      icon,
    );
  }
}
