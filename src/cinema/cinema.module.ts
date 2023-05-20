import { Module } from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CinemaController } from './cinema.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cinema } from './entities/cinema.entity';
import { Province } from 'src/province/entities/province.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cinema, Province])],
  controllers: [CinemaController],
  providers: [CinemaService],
})
export class CinemaModule {}
