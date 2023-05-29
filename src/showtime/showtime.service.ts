import { BadRequestException, Injectable } from '@nestjs/common';
import { Movie } from 'src/movie/entities/movie.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Showtime } from './entities/showtime.entity';
import { addMinutes } from 'date-fns';
import { Cinema } from 'src/cinema/entities/cinema.entity';
import { CreateShowtimeDto, GenerateShowtimeDto } from './dto/showtime.dto';
import { generate } from 'short-uuid';
import { Province } from 'src/province/entities/province.entity';

export interface CinemaShowtimes {
  date: Date;
  cinema: Cinema;
  showtimes: Record<string, Showtime[]>;
}

@Injectable()
export class ShowtimeService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    @InjectRepository(Showtime)
    private showtimeRepository: Repository<Showtime>,
    @InjectRepository(Cinema)
    private cinemaRepository: Repository<Cinema>,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
  ) {}

  async create(createShowtimeDto: CreateShowtimeDto) {
    const cinemaShowtimes: CinemaShowtimes = await this.validate(
      createShowtimeDto,
    );

    const localeDate = new Date(cinemaShowtimes.date).toLocaleDateString();

    await this.showtimeRepository.delete({
      date: localeDate,
      cinema: { id: cinemaShowtimes.cinema.id },
    });
    for (const room in cinemaShowtimes.showtimes) {
      const roomShowtime = cinemaShowtimes.showtimes[room];
      const newShowtimes: Showtime[] = [];

      for (const showtime of roomShowtime) {
        const newShowtime = new Showtime();
        newShowtime.id = generate();
        newShowtime.date = localeDate;
        newShowtime.start = showtime.start;
        newShowtime.end = showtime.end;
        newShowtime.movie = showtime.movie;
        newShowtime.cinema = cinemaShowtimes.cinema;
        newShowtime.room = parseInt(room);
        newShowtimes.push(newShowtime);
      }
      await this.showtimeRepository.insert(newShowtimes);
    }

    return this.showtimeRepository.find({
      where: { date: localeDate },
      order: { start: 'ASC' },
    });
  }
  async validate(createShowtimeDto: CreateShowtimeDto) {
    const { cinemaId, date, roomShowtimes } = createShowtimeDto;
    const DAY_START_HOUR = 9;
    // Start from 9am
    let start = new Date(date);
    start.setHours(0);
    // Check if date is after current time
    if (start < new Date()) {
      throw new BadRequestException('date must be after current time');
    }

    const cinema = await this.cinemaRepository.findOneBy({
      id: Number(cinemaId),
    });

    // Check if cinema exists
    if (!cinema) {
      throw new BadRequestException('cinema must exist');
    }
    for (const room in roomShowtimes) {
      const roomInt = parseInt(room);
      if (isNaN(roomInt) || roomInt < 1 || roomInt > cinema.number_of_rooms) {
        throw new BadRequestException('room not correct');
      }
    }

    const cinemaShowtimes: CinemaShowtimes = {
      date: start,
      cinema: cinema,
      showtimes: {},
    };
    const movies = await this.movieRepository.find({
      where: { isShowing: true },
    });
    for (const room in roomShowtimes) {
      start = new Date(date);
      start.setHours(DAY_START_HOUR);
      start.setMinutes(0);
      start.setSeconds(0);
      cinemaShowtimes.showtimes[room] = [];

      for (const movieId of roomShowtimes[room]) {
        const movie = movies.find((movie) => movie.id === movieId);

        if (!movie) {
          throw new Error(`Movie with ID ${movieId} not found`);
        }

        // Round up start time to nearest multiple of 5
        if (start.getMinutes() !== 0 && start.getMinutes() % 5 !== 0) {
          start = addMinutes(start, 5 - (start.getMinutes() % 5));
        }

        const durationInMinutes = movie.duration;
        const end = addMinutes(start, durationInMinutes);

        const showtime = new Showtime();
        showtime.start = start;
        showtime.end = end;
        showtime.movie = movie;

        cinemaShowtimes.showtimes[room].push(showtime);

        start = addMinutes(start, durationInMinutes + 15); // add 15 minutes for cleanup

        if (start.getHours() < DAY_START_HOUR) break;
      }
    }

    return cinemaShowtimes;
  }

  async generate(
    generateShowtimeDto: GenerateShowtimeDto,
  ): Promise<CinemaShowtimes> {
    const { date, movieIds, cinemaId } = generateShowtimeDto;

    const newDate = new Date(date);
    // Check if date is after current time
    if (newDate < new Date()) {
      throw new BadRequestException('date must be after current time');
    }

    const movies = await this.movieRepository
      .createQueryBuilder('movie')
      .whereInIds(movieIds)
      .getMany();

    // Check if movies array is empty
    if (movies.length === 0) {
      throw new BadRequestException('movies must not be empty');
    }

    const cinema = await this.cinemaRepository.findOneBy({
      id: Number(cinemaId),
    });

    // Check if cinema exists
    if (!cinema) {
      throw new BadRequestException('cinema must exist');
    }
    return this.generateShowtimes(movies, cinema, newDate);
  }

  public generateShowtimes(
    movies: Movie[],
    cinema: Cinema,
    date: Date,
  ): CinemaShowtimes {
    const DAY_START_HOUR = 9;
    // Start from 9am
    let start = date;

    const cinemaShowtimes: CinemaShowtimes = {
      date: start,
      cinema: cinema,
      showtimes: {},
    };

    for (let room = 1; room <= cinema.number_of_rooms; room++) {
      start.setHours(DAY_START_HOUR);
      start.setMinutes(0);
      start.setSeconds(0);
      cinemaShowtimes.showtimes[room] = [];
      while (start.getHours() >= DAY_START_HOUR) {
        // Select a random movie from the list
        const movie = movies[Math.floor(Math.random() * movies.length)];

        // Round up start time to nearest multiple of 5
        if (start.getMinutes() !== 0 && start.getMinutes() % 5 !== 0) {
          start = addMinutes(start, 5 - (start.getMinutes() % 5));
        }
        const durationInMinutes = movie.duration;
        const end = addMinutes(start, durationInMinutes);

        const showtime = new Showtime();
        showtime.start = start;
        showtime.end = end;
        showtime.movie = movie;
        cinemaShowtimes.showtimes[room].push(showtime);

        start = addMinutes(start, durationInMinutes + 15); // add 15 minutes for cleanup
      }
    }

    return cinemaShowtimes;
  }

  async getShowtimeByCinema(cinemaId: string, date: string): Promise<any[]> {
    const cinemaIdInt = parseInt(cinemaId);
    if (isNaN(cinemaIdInt)) {
      throw new BadRequestException('room not correct');
    }

    const cinema = await this.cinemaRepository.findOneBy({
      id: cinemaIdInt,
    });
    // Check if cinema exists
    if (!cinema) {
      throw new BadRequestException('cinema must exist');
    }
    const localeDate = new Date(date).toLocaleDateString();
    const showtimes = await this.showtimeRepository.find({
      where: { date: localeDate, cinema: { id: cinema.id } },
      order: { start: 'ASC' },
      relations: ['movie'],
    });

    const groupedShowtimes = {};
    showtimes.forEach((showtime) => {
      const movieId = showtime.movie.id;
      if (!groupedShowtimes[movieId]) {
        groupedShowtimes[movieId] = {
          movie: {
            id: showtime.movie.id,
            name: showtime.movie.name,
            rated: showtime.movie.rated,
            image: showtime.movie.image,
          },
          showtimes: [],
        };
      }
      delete showtime.movie;
      delete showtime.date;
      delete showtime.room;
      groupedShowtimes[movieId].showtimes.push(showtime);
    });

    return Object.values(groupedShowtimes);
  }
  async getShowtimeByMovie(movieId: string, date: string, provinceId: string) {
    const movie = await this.movieRepository.findOneBy({
      id: movieId,
    });
    // Check if movie exists
    if (!movie) {
      throw new BadRequestException('movie must exist');
    }
    const province = await this.provinceRepository.findOne({
      where: { id: parseInt(provinceId) },
      relations: ['cinemas'],
    });
    // Check if province exists
    if (!province) {
      throw new BadRequestException('province must exist');
    }
    const localeDate = new Date(date).toLocaleDateString();

    const cinemaIds = province.cinemas.map((cinema) => cinema.id);
    console.log(cinemaIds);
    const showtimes = await this.showtimeRepository.find({
      where: {
        date: localeDate,
        movie: { id: movie.id },
        cinema: { id: In(cinemaIds) },
      },
      order: { start: 'ASC' },
      relations: ['cinema'],
    });

    const groupedShowtimes = {};
    showtimes.forEach((showtime) => {
      const cinemaId = showtime.cinema.id;
      if (!groupedShowtimes[cinemaId]) {
        groupedShowtimes[cinemaId] = {
          cinema: showtime.cinema,
          showtimes: [],
        };
      }
      delete showtime.cinema;
      delete showtime.date;
      delete showtime.room;

      groupedShowtimes[cinemaId].showtimes.push(showtime);
    });

    return Object.values(groupedShowtimes);
  }

  async initShowtime() {
    await this.showtimeRepository.delete({});
    const DAY_START_HOUR = 9;
    const cinemas = await this.cinemaRepository.find();
    const movies = await this.movieRepository
      .createQueryBuilder('movie')
      .take(8)
      .getMany();

    const showtimes: Showtime[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      for (const cinema of cinemas) {
        for (let room = 1; room < 5; room++) {
          let start = new Date(date);
          start.setHours(DAY_START_HOUR);
          start.setMinutes(0);
          start.setSeconds(0);

          const randomMovies = Array.from({ length: 10 }, () => {
            const randomIndex = Math.floor(Math.random() * movies.length);
            return movies[randomIndex];
          });
          for (const movie of randomMovies) {
            // Round up start time to nearest multiple of 5
            if (start.getMinutes() !== 0 && start.getMinutes() % 5 !== 0) {
              start = addMinutes(start, 5 - (start.getMinutes() % 5));
            }

            const durationInMinutes = movie.duration;
            const end = addMinutes(start, durationInMinutes);

            const showtime = new Showtime();
            showtime.start = start;
            showtime.end = end;
            showtime.movie = movie;
            showtime.id = generate();
            showtime.date = start.toLocaleDateString();
            showtime.movie = movie;
            showtime.cinema = cinema;
            showtime.room = room;

            showtimes.push(showtime);

            start = addMinutes(start, durationInMinutes + 15); // add 15 minutes for cleanup

            if (start.getHours() < DAY_START_HOUR) break;
          }
        }
      }
    }
    return this.showtimeRepository.insert(showtimes);
  }

  async findOne(id: string) {
    // `This action returns a #${id} movie`;
    const showtime = await this.showtimeRepository.findOne({
      where: { id: id },
      relations: ['movie', 'cinema'],
    });
    if (!showtime) {
      throw new BadRequestException('showtime not found');
    }
    return showtime;
  }

  async findAll() {
    // `This action returns a #${id} movie`;
    const showtimes = await this.showtimeRepository.find({
      relations: ['movie'],
    });
    if (!showtimes) {
      throw new BadRequestException('showtime not found');
    }
    return showtimes;
  }
}
