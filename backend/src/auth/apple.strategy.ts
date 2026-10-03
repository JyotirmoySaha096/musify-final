import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-apple';
import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  private readonly logger = new Logger(AppleStrategy.name);

  constructor(private authService: AuthService) {
    super({
      clientID: process.env.APPLE_CLIENT_ID || 'your-apple-client-id',
      teamID: process.env.APPLE_TEAM_ID || 'your-apple-team-id',
      keyID: process.env.APPLE_KEY_ID || 'your-apple-key-id',
      // The private key could be a file path or a string. For simplicity we expect a single-line string with \n replaced.
      privateKeyString: process.env.APPLE_PRIVATE_KEY
        ? process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : 'your-apple-private-key',
      callbackURL:
        process.env.APPLE_CALLBACK_URL ||
        'http://localhost:3001/auth/apple/callback',
      passReqToCallback: false,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    idToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    try {
      const id = profile?.id;
      const email = profile?.email || `${id}@apple.com`;
      const name = profile?.name
        ? `${profile.name.firstName} ${profile.name.lastName}`
        : null;

      const user = {
        email,
        username: name
          ? name.replace(/\s+/g, '') + Math.floor(Math.random() * 1000)
          : `user${id}`,
      };

      const payload = await this.authService.validateOAuthLogin(
        user,
        'apple',
        id,
      );
      done(null, payload);
    } catch (err) {
      this.logger.error('Apple validate error', err);
      done(err, false);
    }
  }
}
