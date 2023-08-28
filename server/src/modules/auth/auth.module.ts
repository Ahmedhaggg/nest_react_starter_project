import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { GoogleAuthController } from './controllers/google-auth.controller';
import { AuthService } from './services/auth.service';
import { GoogleStrategy } from './stratgies/GoogleStrategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule, 
    PassportModule.register({ defaultStrategy: "google" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
          return {
            secret: config.get("JWT_SECRET"),
            signOptions: { expiresIn: "1h" }
          }
      },
    })
  ],
  controllers: [
    AuthController, 
    GoogleAuthController
  ],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
