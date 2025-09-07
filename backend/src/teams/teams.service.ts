import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Team, User, TeamMember, TeamRole } from '@prisma/client';
import { customAlphabet } from 'nanoid';

// Generate short, readable invite codes
const generateInviteCode = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

export interface CreateTeamDto {
  name: string;
  description?: string;
  timezone?: string;
}

export interface UpdateTeamDto {
  name?: string;
  description?: string;
  timezone?: string;
}

export interface TeamWithMembers extends Team {
  members: (TeamMember & {
    user: User;
  })[];
  owner: User;
  _count?: {
    members: number;
  };
}

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async createTeam(ownerId: string, createTeamDto: CreateTeamDto): Promise<TeamWithMembers> {
    // Generate unique slug and invite code
    const baseSlug = createTeamDto.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    let slug = baseSlug;
    let counter = 1;
    
    // Ensure slug is unique
    while (await this.prisma.team.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const team = await this.prisma.team.create({
      data: {
        name: createTeamDto.name,
        description: createTeamDto.description,
        slug,
        timezone: createTeamDto.timezone || 'UTC',
        inviteCode: generateInviteCode(),
        ownerId,
        members: {
          create: {
            userId: ownerId,
            role: TeamRole.OWNER,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        owner: true,
      },
    });

    return team;
  }

  async getUserTeams(userId: string): Promise<TeamWithMembers[]> {
    const teamMembers = await this.prisma.teamMember.findMany({
      where: { userId },
      include: {
        team: {
          include: {
            members: {
              include: {
                user: true,
              },
            },
            owner: true,
            _count: {
              select: { members: true },
            },
          },
        },
      },
    });

    return teamMembers.map(tm => tm.team);
  }

  async getTeamById(teamId: string, userId: string): Promise<TeamWithMembers> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        owner: true,
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Check if user is a member of the team
    const isMember = team.members.some(member => member.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this team');
    }

    return team;
  }

  async updateTeam(
    teamId: string,
    userId: string,
    updateTeamDto: UpdateTeamDto,
  ): Promise<TeamWithMembers> {
    const team = await this.getTeamById(teamId, userId);

    // Check if user is owner or admin
    const userMember = team.members.find(member => member.userId === userId);
    if (!userMember || !['OWNER', 'ADMIN'].includes(userMember.role)) {
      throw new ForbiddenException('Only team owners and admins can update team settings');
    }

    const updatedTeam = await this.prisma.team.update({
      where: { id: teamId },
      data: updateTeamDto,
      include: {
        members: {
          include: {
            user: true,
          },
        },
        owner: true,
      },
    });

    return updatedTeam;
  }

  async joinTeamByInviteCode(userId: string, inviteCode: string): Promise<TeamWithMembers> {
    const team = await this.prisma.team.findUnique({
      where: { inviteCode },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        owner: true,
      },
    });

    if (!team) {
      throw new NotFoundException('Invalid invite code');
    }

    // Check if user is already a member
    const existingMember = team.members.find(member => member.userId === userId);
    if (existingMember) {
      return team;
    }

    // Add user to team
    await this.prisma.teamMember.create({
      data: {
        userId,
        teamId: team.id,
        role: TeamRole.MEMBER,
      },
    });

    // Return updated team
    return this.getTeamById(team.id, userId);
  }

  async removeMember(teamId: string, requesterId: string, memberUserId: string): Promise<void> {
    const team = await this.getTeamById(teamId, requesterId);
    
    // Get requester's role
    const requesterMember = team.members.find(member => member.userId === requesterId);
    if (!requesterMember) {
      throw new ForbiddenException('You are not a member of this team');
    }

    // Get target member's role
    const targetMember = team.members.find(member => member.userId === memberUserId);
    if (!targetMember) {
      throw new NotFoundException('Member not found');
    }

    // Permission checks
    if (requesterId === memberUserId) {
      // Users can remove themselves (leave team)
      if (requesterMember.role === TeamRole.OWNER) {
        throw new ForbiddenException('Team owner cannot leave the team. Transfer ownership first.');
      }
    } else {
      // Removing another member requires admin/owner permissions
      if (!['OWNER', 'ADMIN'].includes(requesterMember.role)) {
        throw new ForbiddenException('Only owners and admins can remove team members');
      }

      // Owners can't be removed by admins
      if (targetMember.role === TeamRole.OWNER && requesterMember.role !== TeamRole.OWNER) {
        throw new ForbiddenException('Cannot remove team owner');
      }
    }

    // Remove the member
    await this.prisma.teamMember.delete({
      where: {
        userId_teamId: {
          userId: memberUserId,
          teamId,
        },
      },
    });
  }

  async updateMemberRole(
    teamId: string,
    requesterId: string,
    memberUserId: string,
    newRole: TeamRole,
  ): Promise<TeamMember> {
    const team = await this.getTeamById(teamId, requesterId);
    
    // Only owners can change roles
    const requesterMember = team.members.find(member => member.userId === requesterId);
    if (!requesterMember || requesterMember.role !== TeamRole.OWNER) {
      throw new ForbiddenException('Only team owners can change member roles');
    }

    const targetMember = team.members.find(member => member.userId === memberUserId);
    if (!targetMember) {
      throw new NotFoundException('Member not found');
    }

    // Can't change owner role
    if (targetMember.role === TeamRole.OWNER || newRole === TeamRole.OWNER) {
      throw new ForbiddenException('Cannot change owner role');
    }

    const updatedMember = await this.prisma.teamMember.update({
      where: {
        userId_teamId: {
          userId: memberUserId,
          teamId,
        },
      },
      data: { role: newRole },
    });

    return updatedMember;
  }

  async regenerateInviteCode(teamId: string, userId: string): Promise<string> {
    const team = await this.getTeamById(teamId, userId);
    
    // Check if user is owner or admin
    const userMember = team.members.find(member => member.userId === userId);
    if (!userMember || !['OWNER', 'ADMIN'].includes(userMember.role)) {
      throw new ForbiddenException('Only team owners and admins can regenerate invite codes');
    }

    const newInviteCode = generateInviteCode();

    await this.prisma.team.update({
      where: { id: teamId },
      data: { inviteCode: newInviteCode },
    });

    return newInviteCode;
  }

  async deleteTeam(teamId: string, userId: string): Promise<void> {
    const team = await this.getTeamById(teamId, userId);
    
    // Only owners can delete teams
    if (team.ownerId !== userId) {
      throw new ForbiddenException('Only team owners can delete teams');
    }

    await this.prisma.team.delete({
      where: { id: teamId },
    });
  }
}