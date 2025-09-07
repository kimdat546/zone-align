import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async validateUser(clerkId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { clerkId },
    });
  }

  async findOrCreateUser(clerkId: string): Promise<User> {
    // First check if user exists in our database
    let user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (user) {
      return user;
    }

    // If user doesn't exist, get their data from Clerk and create them
    try {
      const clerkUser = await clerkClient.users.getUser(clerkId);
      
      const email = clerkUser.emailAddresses.find(
        (email) => email.id === clerkUser.primaryEmailAddressId,
      )?.emailAddress;

      if (!email) {
        throw new Error('No email address found for user');
      }

      // Detect timezone (we'll improve this later with frontend detection)
      const timezone = 'UTC'; // Default, will be updated by frontend

      user = await this.prisma.user.create({
        data: {
          clerkId,
          email,
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || email,
          avatar: clerkUser.imageUrl,
          timezone,
          workHours: {
            start: '09:00',
            end: '17:00',
            days: [1, 2, 3, 4, 5], // Monday to Friday
          },
        },
      });

      return user;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async updateUserProfile(
    userId: string,
    updateData: {
      name?: string;
      timezone?: string;
      workHours?: any;
      maxEarlyMeetings?: number;
      maxLateMeetings?: number;
    },
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        teamMembers: {
          include: {
            team: true,
          },
        },
      },
    });
  }
}