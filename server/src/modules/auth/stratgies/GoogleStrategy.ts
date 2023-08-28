import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService} from "@nestjs/config"
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get("GOOGLE_ID"),
      clientSecret: configService.get("GOOGLE_SECRET"),
      callbackURL: "http://localhost/api/v1/auth/google/callback",
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(request: any, accessToken: string, refreshToken: string, profile: any, done: Function) {
    const user = {
      email: profile.emails[0].value,
      username: profile.displayName,
      picture: profile.photos[0].value,
    };

    return done(null, user);
  }
}
