import { IsNotEmpty } from 'class-validator';
import { Cinema } from 'src/cinema/entities/cinema.entity';

export class CreateProvinceDto {
  @IsNotEmpty()
  name: string;

  cinemas?: Cinema[];
}
