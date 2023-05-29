import { Controller, Post, Body, Query, Get, Param } from '@nestjs/common';
import { CinemaShowtimes, ShowtimeService } from './showtime.service';
import { CreateShowtimeDto, GenerateShowtimeDto } from './dto/showtime.dto';

@Controller('showtime')
export class ShowtimeController {
  constructor(private readonly showtimeService: ShowtimeService) {}

  @Get('cinema')
  getShowtimeByCinema(@Query() { cinemaId, date }) {
    return this.showtimeService.getShowtimeByCinema(cinemaId, date);
  }

  @Get('movie')
  getShowtimeByMovie(@Query() { movieId, date, provinceId }) {
    return this.showtimeService.getShowtimeByMovie(movieId, date, provinceId);
  }
  @Get('init')
  initShowtime() {
    return this.showtimeService.initShowtime();
  }

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
  @Get()
  findAll() {
    return this.showtimeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showtimeService.findOne(id);
  }
}
