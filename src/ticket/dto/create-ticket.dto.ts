import { IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
  foods: any[];
  @IsNotEmpty()
  paymentMethod: string;
  @IsNotEmpty()
  seat: string[];
  @IsNotEmpty()
  showtime: string;
}
