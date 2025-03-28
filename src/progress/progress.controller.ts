/* eslint-disable @typescript-eslint/no-unsafe-return */
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
import { ProgressService } from './progress.service';
import { Progress } from '../schemas/progress.schema';

@Controller('progress')
@UseGuards(AuthGuard('jwt'))
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  async getUserProgress(@Req() req): Promise<Progress[]> {
    const userId = req.user.userId;
    return this.progressService.findByUserId(userId);
  }

  @Get('detailed')
  async getDetailedUserProgress(@Req() req): Promise<any[]> {
    const userId = req.user.userId;
    return this.progressService.findDetailedProgressByUserId(userId);
  }

  @Post(':moduleType')
  async updateProgress(
    @Req() req,
    @Param('moduleType') moduleType: string,
    @Body('progress') progress: number,
  ): Promise<Progress> {
    const userId = req.user.userId;
    return this.progressService.updateProgress(userId, moduleType, progress);
  }
}
