import { Injectable } from '@nestjs/common';
import { Province } from './entities/province.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cinema } from 'src/cinema/entities/cinema.entity';
import { initProvinceData } from 'src/common/InitialDB/initialDB';
import { provinceInit } from 'src/common/InitialDB/provinceInit';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
  ) {}

  async findAll(
    page = 1,
    limit = 10,
    sort = 'name',
    order: 'ASC' | 'DESC' = 'DESC',
    filter: 'null' | 'notNull' | 'all' = 'all',
  ) {
    const queryBuilder = this.provinceRepository.createQueryBuilder('province');

    queryBuilder.leftJoinAndSelect('province.cinemas', 'cinema');

    if (filter !== 'all') {
      queryBuilder.where(`cinema.id IS ${filter == 'null' ? '' : 'NOT'} NULL`);
    }

    // Apply sorting

    queryBuilder.orderBy(`province.${sort}`, order);

    // Apply pagination
    queryBuilder.skip((page - 1) * limit).take(limit);

    // Execute query and count total results
    const [provices, count] = await queryBuilder.getManyAndCount();

    return {
      data: provices,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }

  findOne(id: number): Promise<Province> {
    return this.provinceRepository.findOne({
      where: { id: id },
      relations: {
        cinemas: true,
      },
    });
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
        newCinema.name = cinema.name;
        newCinema.address_url = cinema.address_url;

        newProvince.cinemas.push(newCinema);
      }
      provinces.push(newProvince);
    }
    for (const province of provinceInit) {
      const newProvince = new Province();
      newProvince.name = province.name;
      provinces.push(newProvince);
    }

    return this.provinceRepository.save(provinces);
  }
}
