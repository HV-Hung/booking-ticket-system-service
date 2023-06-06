import { Controller, Get, Param } from "@nestjs/common";
import { StatisticsService } from "./statistics.service";

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) { }

  @Get('countUser')
  getCountUser() {
    return this.statisticsService.getCountUser();
  }

  @Get('getTotalAllTime')
  getTotalAllTime() {
    return this.statisticsService.getTotalAllTime();
  }

  @Get('getTotalEachMonth/:year')
  getTotalEachMonth(@Param('year') year: number) {
    return this.statisticsService.getTotalEachMonth(year);
  }

  @Get('getLatestTicket')
  getLatestTicket() {
    return this.statisticsService.getLatestTicket();
  }

  @Get('getCountTicket')
  getCountTicket() {
    return this.statisticsService.getCountTicket();
  }

  @Get('getCountCinema')
  getCountCinema() {
    return this.statisticsService.getCountCinema();
  }

}