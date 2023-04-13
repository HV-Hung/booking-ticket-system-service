import { Controller, Post, Body } from '@nestjs/common';
import { CinemaShowtimes, ShowtimeService } from './showtime.service';
import { CreateShowtimeDto, GenerateShowtimeDto } from './dto/showtime.dto';

@Controller('showtime')
export class ShowtimeController {
  constructor(private readonly showtimeService: ShowtimeService) {}

  @Post()
  create(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimeService.create(createShowtimeDto);
  }
  @Post('validate')
  validate(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimeService.validate(createShowtimeDto);
  }
  @Post('generate')
  generate(
    @Body() generateShowtimeDto: GenerateShowtimeDto,
  ): Promise<CinemaShowtimes> {
    return this.showtimeService.generate(generateShowtimeDto);
  }
}
