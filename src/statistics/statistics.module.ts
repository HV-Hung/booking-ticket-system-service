import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cinema } from 'src/cinema/entities/cinema.entity';
import { Showtime } from 'src/showtime/entities/showtime.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { User } from 'src/user/entities/user.entity';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Showtime, Ticket, Cinema])],
    controllers: [StatisticsController],
    providers: [StatisticsService],
  })
export class StatisticsModule {}
