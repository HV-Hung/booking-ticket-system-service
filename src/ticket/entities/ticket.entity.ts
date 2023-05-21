import { Showtime } from 'src/showtime/entities/showtime.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Showtime, (showtime) => showtime.tickets)
  showtime: Showtime;

  @ManyToOne(() => User, (user) => user.tickets)
  user: User;

  @Column('text', { array: true, default: [] })
  seat: string[];

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  foods: any;

  @Column()
  paymentMethod: string;

  @Column()
  movieName: string;

  @Column()
  cinemaName: string;

  @Column()
  totalTicket: number;

  @Column()
  totalFood: number;

  @Column()
  movieImage: string;
  @Column()
  code: string;
}
