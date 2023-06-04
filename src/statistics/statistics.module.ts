import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showtime } from 'src/showtime/entities/showtime.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { User } from 'src/user/entities/user.entity';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Showtime, Ticket])],
    controllers: [StatisticsController],
    providers: [StatisticsService],
  })
export class StatisticsModule {}
