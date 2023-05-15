import { Injectable } from '@nestjs/common';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cinema } from './entities/cinema.entity';
import { IsNull, Repository } from 'typeorm';
import { Province } from 'src/province/entities/province.entity';

@Injectable()
export class CinemaService {
  constructor(
    @InjectRepository(Cinema) private cinemaRepository: Repository<Cinema>,
  ) {}
  create(createCinemaDto: CreateCinemaDto) {
    return 'This action adds a new cinema';
  }

  // findAll(provinceId: string) {
  //   return this.cinemaRepository.find({ relations: { province: true },
  //     where: {
  //       deleteAt: IsNull(),
  //       provinceId,
  //     }, });
  // }

  findCinemasByProvinceId(provinceId: string) {
    // return this.cinemaRepository.find({ relations: { province: true },
    //   where: {
    //     deleteAt: IsNull(),
    //     provinceId,
    //   }, });
  }

  findOne(id: number) {
    //return `This action returns a #${id} cinema`;
    const cinema = this.cinemaRepository.findOneBy({
      id: id,
      deleteAt: IsNull(),
    });

    return cinema;
  }

  update(id: number, updateCinemaDto: UpdateCinemaDto) {
    //return `This action updates a #${id} cinema`;
    try{
      const updateResult = this.cinemaRepository.save(updateCinemaDto);
      return {result: 'Success - Cập nhật thành công'};
    }
    catch{
      return {result: 'Fail - Cập nhật thất bại'};
    }
  }

  async remove(id: number) {
    //return `This action removes a #${id} cinema`;
    const existingCinema = await this.cinemaRepository.findOneBy({
      id: id
    });
    
    if(existingCinema == null || existingCinema.deleteAt != null){
      return {result: 'Fail - Xóa thất bại'};
    }
    else{
      existingCinema.deleteAt = new Date(Date.now()).toLocaleDateString();
      const deleteResult = this.cinemaRepository.save(existingCinema);
      return {result: 'Success - Xóa thành công'};
    }
  }
}
