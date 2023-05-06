import { InputType } from '@nestjs/graphql';
import { Genre } from 'src/movie/entities/movie.entity';
import { IsNotEmpty, IsEnum, IsDate, IsNumber } from 'class-validator';

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
  @IsDate()
  releaseDate: Date;

  @IsNotEmpty()
  @IsEnum(Genre, { each: true })
  genre: Genre[];
  
  @IsNotEmpty()
  @IsNumber()
  duration: number;
  
  @IsNotEmpty()
  language: string;
  
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  age: string;
  
  @IsNotEmpty()
  trailer_url: string;
}
