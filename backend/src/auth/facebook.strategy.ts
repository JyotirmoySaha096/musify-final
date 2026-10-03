import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID || 'your-facebook-client-id',
      clientSecret:
        process.env.FACEBOOK_CLIENT_SECRET || 'your-facebook-client-secret',
      callbackURL:
        process.env.FACEBOOK_CALLBACK_URL ||
        'http://localhost:3001/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name', 'displayName'],
      scope: ['email'],
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
      email: emails?.[0]?.value || `${id}@facebook.com`,
      username: displayName
        ? displayName.replace(/\s+/g, '') + Math.floor(Math.random() * 1000)
        : `user${id}`,
    };

    const payload = await this.authService.validateOAuthLogin(
      user,
      'facebook',
      id,
    );
    done(null, payload);
  }
}
