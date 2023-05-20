import { PartialType } from '@nestjs/mapped-types';
import { CreateCinemaDto } from './create-cinema.dto';
import { IsNotEmpty, IsDate, IsNumber} from 'class-validator';

export class UpdateCinemaDto extends PartialType(CreateCinemaDto) {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
