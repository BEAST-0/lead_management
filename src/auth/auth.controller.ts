import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
/**
 * Authentication endpoints for registration and login.
 */
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  /**
   * Register a user with email and password.
   */
  register(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.register(email, password);
  }

  @Post('login')
  /**
   * Login with email and password to obtain a JWT.
   */
  login(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.login(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test-auth')
  /**
   * Simple auth check to verify JWT validity.
   */
  test(@Req() req: any) {
    return {
      message: 'JWT works',
      user: req.user,
    };
  }
}
