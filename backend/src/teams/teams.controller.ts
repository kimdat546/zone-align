import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import type { CreateTeamDto, UpdateTeamDto } from './teams.service';
import { ClerkGuard } from '../auth/clerk.guard';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TeamRole } from '@prisma/client';

export class JoinTeamDto {
  @IsString()
  inviteCode: string;
}

export class UpdateMemberRoleDto {
  @IsEnum(TeamRole)
  role: TeamRole;
}

@Controller('api/v1/teams')
@UseGuards(ClerkGuard)
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Post()
  async createTeam(@Request() req, @Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.createTeam(req.user.id, createTeamDto);
  }

  @Get()
  async getUserTeams(@Request() req) {
    return this.teamsService.getUserTeams(req.user.id);
  }

  @Get(':teamId')
  async getTeam(@Request() req, @Param('teamId') teamId: string) {
    return this.teamsService.getTeamById(teamId, req.user.id);
  }

  @Put(':teamId')
  async updateTeam(
    @Request() req,
    @Param('teamId') teamId: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamsService.updateTeam(teamId, req.user.id, updateTeamDto);
  }

  @Delete(':teamId')
  async deleteTeam(@Request() req, @Param('teamId') teamId: string) {
    await this.teamsService.deleteTeam(teamId, req.user.id);
    return { message: 'Team deleted successfully' };
  }

  @Post('join')
  async joinTeam(@Request() req, @Body() joinTeamDto: JoinTeamDto) {
    return this.teamsService.joinTeamByInviteCode(req.user.id, joinTeamDto.inviteCode);
  }

  @Delete(':teamId/members/:userId')
  async removeMember(
    @Request() req,
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    await this.teamsService.removeMember(teamId, req.user.id, userId);
    return { message: 'Member removed successfully' };
  }

  @Put(':teamId/members/:userId/role')
  async updateMemberRole(
    @Request() req,
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
    @Body() updateRoleDto: UpdateMemberRoleDto,
  ) {
    return this.teamsService.updateMemberRole(
      teamId,
      req.user.id,
      userId,
      updateRoleDto.role,
    );
  }

  @Post(':teamId/invite-code/regenerate')
  async regenerateInviteCode(@Request() req, @Param('teamId') teamId: string) {
    const newCode = await this.teamsService.regenerateInviteCode(teamId, req.user.id);
    return { inviteCode: newCode };
  }
}