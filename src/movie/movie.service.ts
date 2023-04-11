import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { initMovieData } from 'src/common/InitialDB/initialDB';
import { Genre, Movie } from './entities/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { generate } from 'short-uuid';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const existingMovie = await this.movieRepository.findOneBy({
      name: createMovieDto.name,
      director: createMovieDto.director,
      releaseDate: createMovieDto.releaseDate,
      deleteAt: IsNull(),

    });

    if (existingMovie) {
      throw new HttpException(
        'This movie already exists - Phim này đã có sẵn trong hệ thống',
        HttpStatus.CONFLICT,
      );
    }

    const id = generate();

    const newMovie = this.movieRepository.create({ id, ...createMovieDto });

    return this.movieRepository.save(newMovie);
  }

  findAll() {
    return this.movieRepository.find({
      where: {
        deleteAt: IsNull(),
      },
  });
  }

  findOne(id: string) {
    // `This action returns a #${id} movie`;
    const movie = this.movieRepository.findOneBy({
      id: id,
      deleteAt: IsNull(),
    });

    return movie;
  }

  update(id: string, updateMovieDto: UpdateMovieDto) {
    //return `This action updates a #${id} movie`;
    try{
      
      const updateResult = this.movieRepository.save(updateMovieDto);
      return {result: 'Success - Cập nhật thành công'};
    }
    catch{
      return {result: 'Fail - Cập nhật thất bại'};
    }

  }

  async remove(id: string) {
    //`This action removes a #${id} movie`;
    const existingMovie = await this.movieRepository.findOneBy({
      id: id
    });
    
    if(existingMovie == null || existingMovie.deleteAt != null){
      return {result: 'Fail - Xóa thất bại'};
    }
    else{
      existingMovie.deleteAt = new Date(Date.now()).toLocaleDateString();
      const deleteResult = this.movieRepository.save(existingMovie);
      return {result: 'Success - Xóa thành công'};
    }

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
