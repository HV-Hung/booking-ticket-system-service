import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Rating } from './rating.entity';
import { Showtime } from 'src/showtime/entities/showtime.entity';

export enum Genre {
  HANH_DONG = 'Hành động',
  TINH_CAM = 'Tình cảm',
  HAI = 'Hài',
  KINHDI = 'Kinh dị',
  KHOA_HOC_VIEN_TUONG = 'Khoa học viễn tưởng',
  HOAT_HINH = 'Hoạt hình',
  TAM_LY = 'Tâm Lý',
  TOI_PHAM = 'Tội phạm',
  PHIM_TAILIEU = 'Phim tài liệu',
  PHIEU_LUU = 'Phiêu Lưu',
  THAN_THOAI = 'Thần thoại',
}

@Entity()
export class Movie {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  image: string;

  @Column({ nullable: false })
  director: string;

  @Column({ nullable: false })
  actors: string;

  @Column({ type: 'date', nullable: false })
  releaseDate: Date;

  @Column({
    type: 'enum',
    enum: Genre,
    array: true,
  })
  genre: Genre[];

  @Column({ nullable: false, default: true })
  isShowing: boolean;

  @Column({ nullable: false })
  duration: number;

  @Column()
  language: string;

  @Column({ nullable: false, type: 'text' })
  description: string;

  @Column({ nullable: true })
  rated: string;

  @Column({ nullable: true })
  trailer_url: string;

  @Column({ default: null })
  deleteAt: string;

  @OneToMany(() => Rating, (rating) => rating.movie)
  rating: Rating[];
  @OneToMany(() => Showtime, (showtime) => showtime.movie)
  showtimes: Showtime[];
}
