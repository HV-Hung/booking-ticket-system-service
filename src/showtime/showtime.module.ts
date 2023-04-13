import { Module } from '@nestjs/common';
import { ShowtimeService } from './showtime.service';
import { ShowtimeController } from './showtime.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from 'src/movie/entities/movie.entity';
import { Showtime } from './entities/showtime.entity';
import { Cinema } from 'src/cinema/entities/cinema.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Showtime, Cinema])],
  controllers: [ShowtimeController],
  providers: [ShowtimeService],
})
export class ShowtimeModule {}
