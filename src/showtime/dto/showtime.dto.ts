import { IsArray, IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { Showtime } from '../entities/showtime.entity';

export class GenerateShowtimeDto {
  @IsNotEmpty()
  @IsNumberString()
  cinemaId: number;

  @IsNotEmpty()
  @IsArray()
  movieIds: string[];

  @IsNotEmpty()
  @IsString()
  date: Date;
}

export class CreateShowtimeDto {
  @IsNotEmpty()
  @IsNumberString()
  cinemaId: number;

  @IsNotEmpty()
  @IsString()
  date: Date;

  @IsNotEmpty()
  roomShowtimes: Record<string, string[]>;
}
