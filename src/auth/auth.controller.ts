import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailDto, OTPDto, SignInDto, UserDto, AdminDto } from './dto/auth.dto';
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
  @Get('logout')
  logout(@Res() res) {
    return this.authService.logout(res);
  }
  @UseGuards(JwtAuthGuard)
  @Get('status')
  async checkStatus() {
    return this.authService.checkStatus();
  }

  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getInfo(@Req() req) {
    return this.authService.getInfo(req.user.email);
  }
  @Post('admin/signup')
  async adminSignUp(@Body() adminDto: AdminDto) {
    return this.authService.adminSignUp(adminDto);
  }
  @Post('admin/signin')
  async adminSignIn(@Body() adminDto: AdminDto, @Res() res) {
    return this.authService.adminSignIn(adminDto, res);
  }
}
