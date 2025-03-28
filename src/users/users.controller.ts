/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { User } from '../schemas/user.schema';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Req() req): Promise<User> {
    const userId = req.user.userId;
    return this.usersService.findOne(userId);
  }

  @Put()
  async update(@Req() req, @Body() updateData: Partial<User>): Promise<User> {
    const userId = req.user.userId;
    return this.usersService.update(userId, updateData);
  }
}
