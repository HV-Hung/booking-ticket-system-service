import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';
import { IsNotEmpty} from 'class-validator';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @IsNotEmpty()
  id: string;
}
