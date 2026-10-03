import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.MICROSOFT_CLIENT_ID || 'your-microsoft-client-id',
      clientSecret:
        process.env.MICROSOFT_CLIENT_SECRET || 'your-microsoft-client-secret',
      callbackURL:
        process.env.MICROSOFT_CALLBACK_URL ||
        'http://localhost:3001/auth/microsoft/callback',
      scope: ['user.read'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { displayName, emails, id } = profile;
    const user = {
      email: emails?.[0]?.value || `${id}@microsoft.com`,
      username: displayName
        ? displayName.replace(/\s+/g, '') + Math.floor(Math.random() * 1000)
        : `user${id}`,
    };

    const payload = await this.authService.validateOAuthLogin(
      user,
      'microsoft',
      id,
    );
    done(null, payload);
  }
}
