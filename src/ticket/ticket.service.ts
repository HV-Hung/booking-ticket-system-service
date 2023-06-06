import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Showtime } from 'src/showtime/entities/showtime.entity';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { seatMap } from './data/seat';
import { foods } from './data/food';
import { generate } from 'short-uuid';
import { initTicketData } from 'src/common/InitialDB/TicketInitial';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Showtime)
    private showtimeRepository: Repository<Showtime>,

    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createTicketDto: CreateTicketDto, email: string) {
    const showtime = await this.showtimeRepository.findOne({
      where: { id: createTicketDto.showtime },
      relations: ['movie', 'cinema'],
    });
    if (!showtime) {
      throw new BadRequestException('showtime not found');
    }
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new HttpException('Token không hợp lệ', HttpStatus.FORBIDDEN);
    }

    for (const seat of createTicketDto.seat) {
      for (const picked of showtime.seats)
        if (picked == seat) throw new BadRequestException('Ghế đã được chọn');
    }

    showtime.seats.push(...createTicketDto.seat);
    const newShowtime = await this.showtimeRepository.save(showtime);

    const pickingSeat = seatMap.filter((seatItem) =>
      createTicketDto.seat.includes(seatItem.id),
    );
    const pickingSeatCode = pickingSeat?.map((seat) => seat.code);

    const newFoods = createTicketDto.foods.map((food) => {
      const newFood: any = foods.filter(
        (foodItem) => food.id === foodItem.id,
      )[0];
      newFood.quantity = food.quantity;
      return newFood;
    });

    const totalFood = newFoods.reduce((a, b) => a + b.price * b.quantity, 0);
    const totalTicket = pickingSeat.reduce((a, b) => a + b.price, 0);

    const ticket = new Ticket();

    ticket.paymentMethod = createTicketDto.paymentMethod;
    ticket.cinemaName = showtime.cinema.name;
    ticket.movieImage = showtime.movie.image;
    ticket.movieName = showtime.movie.name;
    ticket.showtime = newShowtime;
    ticket.user = user;
    ticket.seat = [...pickingSeatCode];
    ticket.foods = newFoods;
    ticket.totalFood = totalFood;
    ticket.totalTicket = totalTicket;
    ticket.code = generate();

    return this.ticketRepository.save(ticket);
  }

  findAll() {
    return this.ticketRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['showtime', 'user'],
    });
  }
  async findTicketByUser(email) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new HttpException('Token không hợp lệ', HttpStatus.FORBIDDEN);
    }
    return this.ticketRepository.find({
      where: { user: { id: user.id } },
      relations: ['showtime'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const ticket = await this.ticketRepository.findOne({
      where: { id: id },
      relations: ['showtime'],
    });
    if (!ticket) {
      throw new BadRequestException('ticket not found');
    }
    return ticket;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }

  async initTicket() {
    // const showtimes = await this.showtimeRepository.createQueryBuilder('movie')
    // .take(5)
    // .getMany();

    // const tickets = [];
    // for (const ticket of initTicketData) {
    //   const newTicket = new Ticket();

    //   newTicket.id = await this.ticketRepository.count() + 1;

    //   newTicket.name = movie.name;
    //   newTicket.actors = movie.actors;
    //   newTicket.description = movie.description;
    //   newTicket.genre = movie.genre as Genre[];
    //   newTicket.director = movie.director;
    //   newTicket.duration = movie.duration;
    //   newTicket.image = movie.image;

    //   const randomShowtime = Array.from({ length: 10 }, () => {
    //     const randomIndex = Math.floor(Math.random() * showtimes.length);
    //     return showtimes[randomIndex];
    //   });

    //   newTicket.showtime = randomShowtime;
    //   newMovie.releaseDate = new Date(movie.releaseDate);
    //   newMovie.trailer_url = movie.trailer_url;
    //   newMovie.rated = movie.rated;

    //   movies.push(newMovie);
    // }
    // return this.movieRepository.save(movies);
    return 'no action';
  }
}
