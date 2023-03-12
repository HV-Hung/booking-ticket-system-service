import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers(
    @Query() { limit, offset, filter, sort },
    @Req() req,
  ): Promise<[User[], number]> {
    console.log('______', { limit, offset, filter, sort });
    return this.userService.getUsers(
      limit,
      offset,
      filter,
      sort,
      req.user.email,
    );
  }
}
