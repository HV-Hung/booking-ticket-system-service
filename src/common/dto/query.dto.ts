import {
  IsObject,
  IsOptional,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'validOrder', async: false })
export class ValidOrder implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return value === 'ASC' || value === 'DESC' || value === undefined;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Order must be "ASC", "DESC", or undefined';
  }
}

export class QueryDto {
  @IsOptional()
  @IsString()
  sort: string;

  @IsOptional()
  @Validate(ValidOrder)
  order?: 'ASC' | 'DESC';

  @IsOptional()
  @IsObject()
  filter: object;
}
