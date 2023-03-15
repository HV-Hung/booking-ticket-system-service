import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Movie } from './movie.entity';
import { User } from 'src/user/entities/user.entity';
import { Max, Min } from 'class-validator';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @Min(0)
  @Max(10)
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @ManyToOne(() => Movie, (movie) => movie.rated)
  movie: Movie;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
