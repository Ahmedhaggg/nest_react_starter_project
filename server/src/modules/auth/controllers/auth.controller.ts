import { Body, Controller, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('v1/auth/tokens')
export class AuthController {
    constructor (private authService: AuthService) {}

    @Get("/")
    async refreshAccessToken(@Body("refreshToken") refreshToken: string) {
        let newAccessToken = await this.authService.refreshAccessToken(refreshToken);
        return { newAccessToken }
    }
}
