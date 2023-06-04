import { InputType } from '@nestjs/graphql';
import { Genre } from 'src/movie/entities/movie.entity';
import { IsNotEmpty, IsEnum, IsNumber } from 'class-validator';

@InputType()
export class CreateMovieDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  director: string;

  @IsNotEmpty()
  actors: string;

  @IsNotEmpty()
  releaseDate: string;

  @IsNotEmpty()
  @IsEnum(Genre, { each: true })
  genre: Genre[];

  @IsNotEmpty()
  duration: number;

  @IsNotEmpty()
  language: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  rated: string;

  @IsNotEmpty()
  trailer_url: string;
}
