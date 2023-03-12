import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class OTPDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  otp: string;
}

export class UserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  otp: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  name: string;

  phone?: string;

  birthDay?: string;

  gender?: 'nam' | 'nữ';
}
export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}
