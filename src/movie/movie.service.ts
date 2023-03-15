import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { initMovieData } from 'src/common/initialDB';
import { Genre, Movie } from './entities/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { generate } from 'short-uuid';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}
  create(createMovieDto: CreateMovieDto) {
    return 'This action adds a new movie';
  }

  findAll() {
    return `This action returns all movie`;
  }

  findOne(id: number) {
    return `This action returns a #${id} movie`;
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`;
  }

  remove(id: number) {
    return `This action removes a #${id} movie`;
  }
  async initMovie() {
    const movies = [];
    for (const movie of initMovieData) {
      const newMovie = new Movie();
      newMovie.id = generate();
      newMovie.name = movie.name;
      newMovie.actors = movie.actors;
      newMovie.description = movie.description;
      newMovie.genre = movie.genre as Genre[];
      newMovie.director = movie.director;
      newMovie.duration = movie.duration;
      newMovie.image = movie.image;
      newMovie.language = movie.language;
      newMovie.releaseDate = new Date(movie.releaseDate);
      newMovie.trailer_url = movie.trailer_url;
      newMovie.age = movie.rated;

      movies.push(newMovie);
    }
    return this.movieRepository.save(movies);
  }
}
