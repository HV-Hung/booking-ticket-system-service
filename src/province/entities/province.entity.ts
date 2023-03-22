import { Cinema } from 'src/cinema/entities/cinema.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Province {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Cinema, (cinema) => cinema.province, {
    cascade: true,
  })
  @JoinColumn()
  cinemas: Cinema[];
}
