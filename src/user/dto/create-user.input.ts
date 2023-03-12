import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  birthDay?: string;

  @Field({ nullable: true })
  gender?: 'nam' | 'nữ';

  @Field()
  name: string;
}
