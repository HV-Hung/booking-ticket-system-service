import { Module } from '@nestjs/common';
import { ShowtimeService } from './showtime.service';
import { ShowtimeController } from './showtime.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from 'src/movie/entities/movie.entity';
import { Showtime } from './entities/showtime.entity';
import { Cinema } from 'src/cinema/entities/cinema.entity';
import { Province } from 'src/province/entities/province.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Showtime, Cinema, Province])],
  controllers: [ShowtimeController],
  providers: [ShowtimeService],
})
export class ShowtimeModule {}
