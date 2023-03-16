import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/guards/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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
  @Get('init')
  async initUser() {
    return this.userService.initUser();
  }
}
