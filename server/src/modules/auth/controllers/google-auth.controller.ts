import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { ProfileDto } from '../dto/profile.dto';

@Controller('v1/auth/google')
export class GoogleAuthController {
    constructor (private authService : AuthService){}
    @Get('/')
    @UseGuards(AuthGuard('google'))
    googleLogin() {}

    @Get('/callback')
    @UseGuards(AuthGuard('google'))
    async googleCallback(@Req() req) {
        const profile : ProfileDto = req.user as ProfileDto;
        return this.authService.login(profile);
    }
}
