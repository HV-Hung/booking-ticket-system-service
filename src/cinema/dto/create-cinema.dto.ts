import { InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsEnum, IsDate, IsNumber, isURL, ValidateIf, IsString, IsUrl } from 'class-validator';


@InputType()
export class CreateCinemaDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;
  
  @IsNotEmpty()
  @ValidateIf(o => o.address_Url === 'value')
  @IsString()
  @IsUrl(undefined, { message: 'address Url is not valid.' })
  address_Url: string;

  @IsNotEmpty()
  @IsNumber()
  number_of_rooms: number;

  @IsNotEmpty()
  @IsNumber()
  provinceId: number;
}

