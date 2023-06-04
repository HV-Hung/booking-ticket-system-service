import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/guards/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { QueryDto } from 'src/common/dto/query.dto';
import { UpdateUserInput } from './dto/update-user.input';

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
  // @Roles(Role.USER)
  // @Get('info')
  getUser(@Req() req) {
    return this.userService.getInfo(req.user.email);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInputDto: UpdateUserInput) {
    return this.userService.update(id, updateInputDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
