import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { Province } from 'src/province/entities/province.entity';
import { Showtime } from 'src/showtime/entities/showtime.entity';
import { Max, Min } from 'class-validator';

@Entity()
export class Cinema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  address_url: string;

  @Column({ default: 4 })
  @Min(1)
  @Max(10)
  number_of_rooms: number;

  @OneToMany(() => Showtime, (showtime) => showtime.cinema)
  showtimes: Showtime[];

  @ManyToOne(() => Province, (province) => province.cinemas)
  province: Province;
}
