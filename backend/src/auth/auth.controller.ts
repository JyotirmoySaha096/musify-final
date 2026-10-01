import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Initiates the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() req: any, @Res() res: any) {
    const { accessToken } = req.user;
    // Redirect back to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/musify/login?token=${accessToken}`);
  }
}
