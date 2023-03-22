import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ProvinceService } from './province.service';

@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Get('init')
  initData() {
    return this.provinceService.initProvince();
  }

  @Get()
  findAll(@Query() { page, limit, sort, order, filter }) {
    return this.provinceService.findAll(page, limit, sort, order, filter);
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.provinceService.findOne(id);
  }
}
