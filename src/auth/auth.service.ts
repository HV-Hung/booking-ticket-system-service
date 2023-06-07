import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { AdminDto, SignInDto, UserDto } from './dto/auth.dto';
import { generate } from 'short-uuid';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions, Response } from 'express';
import { Role } from './guards/role.enum';
import { Admin } from 'src/admin/entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    private mailService: MailService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService,
  ) {}

  randomNotInArray(arr: string[]): string {
    if (arr.length >= 10000) {
      throw new HttpException(
        'Hệ thống quá tải xin vui lòng thử lại sau ít phút',
        HttpStatus.CONFLICT,
      );
    }
    let numStr: string;
    do {
      const num = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
      numStr = num.toString().padStart(4, '0'); // Convert the number to a string and pad it with zeros to ensure it has 4 digits
    } while (arr.includes('opt:' + numStr)); // Check if the number is already in the array
    return numStr;
  }

  async signUp(userDto: UserDto) {
    const foundEmail = await this.cacheManager.get('opt:' + userDto.otp);
    if (foundEmail !== userDto.email) {
      throw new HttpException(
        'Mã otp hết hạn! vui lòng thử lại',
        HttpStatus.CONFLICT,
      );
    } else {
      this.cacheManager.del('opt:' + userDto.otp);
      const existingUser = await this.userRepository.findOneBy({
        email: userDto.email,
      });
      if (existingUser) {
        throw new HttpException('Email đã được đăng ký!', HttpStatus.CONFLICT);
      }
      const hashedPassword = await bcrypt.hash(userDto.password, 10);
      userDto.password = hashedPassword;
      const id = generate();
      delete userDto.otp;
      const newUser = this.userRepository.create({ id, ...userDto });

      const savedUser = await this.userRepository.save(newUser);

      delete savedUser.password;

      return savedUser;
    }
  }
  async validateEmail(email: string) {
    const existingUser = await this.userRepository.findOneBy({
      email: email,
    });
    if (existingUser) {
      throw new HttpException(
        'Email này đã được đăng kí vui lòng sử dụng email khác!',
        HttpStatus.CONFLICT,
      );
    }
    const ExistedOtps: string[] = await this.cacheManager.store.keys('opt:*');
    const otp = this.randomNotInArray(ExistedOtps);
    const expiresIn = 1000 * 60 * 5;

    await this.cacheManager.store.set('opt:' + otp, email, expiresIn);

    // console.log('opt:7479', await this.cacheManager.get('opt:7479'));

    // await this.cacheManager.store.reset();
    // return await this.cacheManager.get('opt:1864');

    await this.mailService.validateEmail(email, otp);
  }

  async validateOTP(email: string, otp: string) {
    const foundEmail = await this.cacheManager.get('opt:' + otp);
    if (foundEmail == email) {
      return 'oke';
    } else {
      throw new HttpException(
        'Mã otp không hợp lệ! vui lòng thử lại',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async signIn(signInDto: SignInDto, res: Response) {
    const existingUser = await this.userRepository.findOne({
      where: { email: signInDto.email },
      select: {
        email: true,
        password: true,
      },
    });

    if (!existingUser) {
      throw new HttpException(
        'Email chưa được đăng ký!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const isPasswordMatch = await bcrypt.compare(
      signInDto.password,
      existingUser.password,
    );
    if (!isPasswordMatch) {
      throw new HttpException(
        'Sai mật khẩu vui lòng thử lại!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const token = this.jwtService.sign({
      email: existingUser.email,
      role: Role.USER,
    });
    if (!token) {
      throw new HttpException('Không có token!', HttpStatus.FORBIDDEN);
    }
    const cookieOptions: CookieOptions = {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      sameSite: 'none',
      secure: true, // only send the cookie over https
    };
    res.cookie('token', token, cookieOptions);
    res.send({ message: 'Đăng nhập thành công!' });
  }

  checkStatus() {
    throw new HttpException('oke', HttpStatus.OK);
  }
  logout(res: Response) {
    res.clearCookie('token', {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      sameSite: 'none',
      secure: true, // only send the cookie over https
    });
    res.send({ message: 'Đăng  thành công!' });
  }
  async getInfo(email) {
    if (!email) {
      throw new HttpException('Token không hợp lệ', HttpStatus.FORBIDDEN);
    }
    const user = this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new HttpException('Token không hợp lệ', HttpStatus.FORBIDDEN);
    }
    return user;
  }

  async adminSignIn(adminDto: AdminDto, res: Response) {
    const existingAdmin = await this.adminRepository.findOne({
      where: { email: adminDto.email },
      select: {
        email: true,
        password: true,
      },
    });

    if (!existingAdmin) {
      throw new HttpException(
        'Email chưa được đăng ký!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const isPasswordMatch = await bcrypt.compare(
      adminDto.password,
      existingAdmin.password,
    );
    if (!isPasswordMatch) {
      throw new HttpException(
        'Sai mật khẩu vui lòng thử lại!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const token = this.jwtService.sign({
      email: adminDto.email,
      role: Role.ADMIN,
    });
    if (!token) {
      throw new HttpException('Không có token!', HttpStatus.FORBIDDEN);
    }
    const cookieOptions: CookieOptions = {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      sameSite: 'none',
      secure: true, // only send the cookie over https
    };
    res.cookie('token', token, cookieOptions);
    res.send({ message: 'Đăng nhập thành công!' });
  }

  async adminSignUp(adminDto: AdminDto) {
    const existingAdmin = await this.adminRepository.findOneBy({
      email: adminDto.email,
    });
    if (existingAdmin) {
      throw new HttpException('Tài khoản đã tồn tại!', HttpStatus.CONFLICT);
    }
    const hashedPassword = await bcrypt.hash(adminDto.password, 10);
    adminDto.password = hashedPassword;

    const newAdmin = this.adminRepository.create(adminDto);

    const savedAdmin = await this.adminRepository.save(newAdmin);

    delete savedAdmin.password;

    return savedAdmin;
  }
}
