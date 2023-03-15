import { Cinema } from 'src/cinema/entities/cinema.entity';
import { Showtime } from 'src/showtime/entities/showtime.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Cinema, (cinema) => cinema.province)
  cinema: Cinema;

  @OneToMany(() => Showtime, (showtime) => showtime.room)
  @JoinColumn()
  showtimes: Showtime[];
}
