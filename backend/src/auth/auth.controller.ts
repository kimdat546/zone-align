import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClerkGuard } from './clerk.guard';
import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsObject()
  workHours?: {
    start: string;
    end: string;
    days: number[];
  };

  @IsOptional()
  @IsNumber()
  maxEarlyMeetings?: number;

  @IsOptional()
  @IsNumber()
  maxLateMeetings?: number;
}

@Controller('api/v1/auth')
@UseGuards(ClerkGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me')
  async getCurrentUser(@Request() req) {
    return this.authService.getUserById(req.user.id);
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() updateData: UpdateProfileDto) {
    return this.authService.updateUserProfile(req.user.id, updateData);
  }
}