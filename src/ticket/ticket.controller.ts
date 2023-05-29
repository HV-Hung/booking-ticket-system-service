import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTicketDto: CreateTicketDto, @Req() req) {
    return this.ticketService.create(createTicketDto, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  findTicketByUser(@Req() req) {
    return this.ticketService.findTicketByUser(req.user.email);
  }

  @Get()
  findAll() {
    return this.ticketService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(+id);
  }
}
