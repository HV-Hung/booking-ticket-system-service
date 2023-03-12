import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailDto, OTPDto, SignInDto, UserDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() userDto: UserDto) {
    return this.authService.signUp(userDto);
  }
  @Post('validate-email')
  async validateMail(@Body() emailDto: EmailDto) {
    return this.authService.validateEmail(emailDto.email);
  }
  @Post('validate-otp')
  async validateOTP(@Body() otpDto: OTPDto) {
    return this.authService.validateOTP(otpDto.email, otpDto.otp);
  }
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto, @Res() res) {
    return this.authService.signIn(signInDto, res);
  }
  @UseGuards(JwtAuthGuard)
  @Get('status')
  async checkStatus() {
    return this.authService.checkStatus();
  }
}
