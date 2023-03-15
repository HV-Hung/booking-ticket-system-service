import { Injectable } from '@nestjs/common';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { Province } from './entities/province.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cinema } from 'src/cinema/entities/cinema.entity';
import { initProvinceData } from 'src/common/initialDB';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
  ) {}
  async create(createProvinceDto: CreateProvinceDto): Promise<Province> {
    const newProvince = this.provinceRepository.create(createProvinceDto);

    return this.provinceRepository.save(newProvince);
  }

  findAll() {
    return this.provinceRepository.find({
      relations: {
        cinemas: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} province`;
  }

  update(id: number, updateProvinceDto: UpdateProvinceDto) {
    return `This action updates a #${id} province`;
  }

  remove(id: number) {
    return `This action removes a #${id} province`;
  }
  async initProvince() {
    const provinces = [];
    for (const province of initProvinceData) {
      const newProvince = new Province();
      newProvince.name = province.name;
      newProvince.cinemas = [];
      for (const cinema of province.cinemas) {
        const newCinema = new Cinema();
        newCinema.address = cinema.address;
        newCinema.name = cinema.address_url;
        newCinema.address_url = cinema.name;

        newProvince.cinemas.push(newCinema);
      }
      provinces.push(newProvince);
    }

    return this.provinceRepository.save(provinces);
  }
}
