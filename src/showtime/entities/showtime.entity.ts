import { Cinema } from 'src/cinema/entities/cinema.entity';
import { Movie } from 'src/movie/entities/movie.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';
@Entity()
export class Showtime {
  @PrimaryColumn('varchar')
  id: string;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column()
  room: number;

  @ManyToOne(() => Cinema, (cinema) => cinema.showtimes)
  cinema: Cinema;

  @ManyToOne(() => Movie, (movie) => movie.showtimes)
  movie: Movie;

  @OneToMany(() => Ticket, (ticket) => ticket.showtime)
  tickets: Ticket[];

  @BeforeInsert()
  @BeforeUpdate()
  async validateRoom() {
    const cinema = await this.cinema; // Load the associated Cinema entity
    if (this.room > cinema.number_of_rooms) {
      throw new Error(
        'The room number cannot be greater than the number of rooms in the cinema',
      );
    }
  }
}
