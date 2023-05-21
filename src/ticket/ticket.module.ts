import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { Ticket } from './entities/ticket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from 'src/movie/entities/movie.entity';
import { Showtime } from 'src/showtime/entities/showtime.entity';
import { Cinema } from 'src/cinema/entities/cinema.entity';
import { Province } from 'src/province/entities/province.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Showtime, Ticket])],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
