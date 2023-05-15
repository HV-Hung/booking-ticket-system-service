import { PartialType } from '@nestjs/mapped-types';
import { CreateCinemaDto } from './create-cinema.dto';
import { IsNotEmpty, IsDate} from 'class-validator';

export class UpdateCinemaDto extends PartialType(CreateCinemaDto) {
    
}
