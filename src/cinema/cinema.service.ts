import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cinema } from './entities/cinema.entity';
import { Equal, IsNull, Repository } from 'typeorm';
import { Province } from 'src/province/entities/province.entity';
import { Exception } from 'handlebars';
import { equal } from 'assert';

@Injectable()
export class CinemaService {
  constructor(
    @InjectRepository(Cinema) private cinemaRepository: Repository<Cinema>,
    @InjectRepository(Province) private provinceRepository: Repository<Province>,
  ) { }
  async create(createCinemaDto: CreateCinemaDto) {
    //return 'This action adds a new cinema';
    const province = await this.checkExistingProvince(createCinemaDto.provinceId);

    const existingCinema = await this.cinemaRepository.findOneBy({
      name: createCinemaDto.name,
      address: createCinemaDto.address,
      number_of_rooms: createCinemaDto.number_of_rooms,
      province: Equal(createCinemaDto.provinceId),
      deleteAt: IsNull(),
    });

    if (existingCinema) {
      throw new HttpException(
        'This cinema already exists - Rạp chiếu này đã có sẵn trong hệ thống',
        HttpStatus.CONFLICT,
      );
    }

    const newCinema = this.cinemaRepository.create({ ...createCinemaDto, province });

    return this.cinemaRepository.save(newCinema);

  }

  findCinemasByProvinceId(provinceId: Number) {
    return this.cinemaRepository.find({
      where: { province: Equal(provinceId), deleteAt: IsNull(), },
    });
  }

  findOne(id: number) {
    //return `This action returns a #${id} cinema`;
    const cinema = this.cinemaRepository.findOneBy({
      id: id,
      deleteAt: IsNull(),
    });

    return cinema;
  }

  async update(id: number, updateCinemaDto: UpdateCinemaDto) {
    //return `This action updates a #${id} cinema`;
    const province = await this.checkExistingProvince(updateCinemaDto.provinceId);

    try {
      
      const updateResult = this.cinemaRepository.update(
        {
          id: updateCinemaDto.id
        },
        {
          name: updateCinemaDto.name,
          address: updateCinemaDto.address,
          address_url: updateCinemaDto.address_Url,
          number_of_rooms: updateCinemaDto.number_of_rooms,
          province: province
        });

        if((await updateResult).affected == 0){
          return { result: 'Fail - Cập nhật thất bại ' };
        }

      return { result: 'Success - Cập nhật thành công ' };
    }
    catch (e) {
      return { result: 'Fail - Cập nhật thất bại ' };
    }
  }

  async remove(id: number) {
    //return `This action removes a #${id} cinema`;
    const existingCinema = await this.cinemaRepository.findOneBy({
      id: id
    });

    if (existingCinema == null || existingCinema.deleteAt != null) {
      return { result: 'Fail - Xóa thất bại' };
    }
    else {
      existingCinema.deleteAt = new Date(Date.now()).toLocaleDateString();
      const deleteResult = this.cinemaRepository.save(existingCinema);
      return { result: 'Success - Xóa thành công' };
    }
  }

  async checkExistingProvince(id: number) {
    const province: Province = await this.provinceRepository.findOneBy({ id: id });
    if (province == null) {
      throw new BadRequestException(
        'This province already exists - Khu vực này không tồn tại trong hệ thống'
      );
    }
    else{
      return province;
    }
  }

}
