import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/guards/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { QueryDto } from 'src/common/dto/query.dto';

interface ResponseUsers {
  data: User[];
  total: number;
  page: number;
  totalPages: number;
}
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  @Get()
  async getUsers(
    @Query() { page, limit, sort, order, filter },
  ): Promise<ResponseUsers> {
    return this.userService.findAll(page, limit, sort, order, filter);
  }
  @Get('init')
  async initUser() {
    return this.userService.initUser();
  }
}
