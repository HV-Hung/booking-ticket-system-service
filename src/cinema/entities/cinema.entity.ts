import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { Province } from 'src/province/entities/province.entity';
import { Room } from 'src/room/entities/room.entity';

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

  @OneToMany(() => Room, (room) => room.cinema)
  rooms: Room[];

  @ManyToOne(() => Province, (province) => province.cinemas)
  province: Province;
}
