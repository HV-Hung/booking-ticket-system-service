import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @PrimaryColumn('varchar')
  @Field()
  id: string;

  @Column({ unique: true, nullable: false })
  @Field()
  email: string;

  @Column({ unique: true, nullable: false, select: false })
  @Field()
  password: string;

  @Column({ nullable: true })
  @Field()
  name: string;

  @Column({ unique: true, nullable: true })
  @Field({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  birthDay?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  gender?: 'nam' | 'nữ';

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  updatedAt: Date;
}
