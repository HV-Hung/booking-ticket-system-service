import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Genre } from 'src/movie/entities/movie.entity';

@InputType()
export class CreateMovieDto {
  
  name: string;

  image: string;
  
  director: string;

  actors: string;

  releaseDate: Date;

  genre: Genre[];
  
  duration: number;
  
  language: string;
  
  description: string;

  age: string;
  
  trailer_url: string;

}
