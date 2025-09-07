import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { AuthService } from './auth.service';

@Injectable()
export class ClerkGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Verify the token with Clerk
      const payload = await clerkClient.verifyToken(token);

      if (!payload || !payload.sub) {
        throw new UnauthorizedException('Invalid token');
      }

      // Get or create user in our database
      const user = await this.authService.findOrCreateUser(payload.sub);
      request.user = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token verification failed');
    }
  }
}