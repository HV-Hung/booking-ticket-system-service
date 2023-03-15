import { Movie } from 'src/movie/entities/movie.entity';
import { Room } from 'src/room/entities/room.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Entity, Column, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
@Entity()
export class Showtime {
  @PrimaryColumn('varchar')
  id: string;

  @Column()
  time: string;

  @Column()
  time_end: string;

  @ManyToOne(() => Movie, (movie) => movie.showtimes)
  movie: Movie;

  @ManyToOne(() => Room, (room) => room.showtimes)
  room: Room;

  @OneToMany(() => Ticket, (ticket) => ticket.showtime)
  tickets: Ticket[];
}
