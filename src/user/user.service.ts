import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { generate } from 'short-uuid';
import { faker } from '@faker-js/faker/locale/vi';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createUserInput: CreateUserInput): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({
      email: createUserInput.email,
    });
    if (existingUser) {
      throw new HttpException(
        'User with that email already exists',
        HttpStatus.CONFLICT,
      );
    }
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    createUserInput.password = hashedPassword;
    const id = generate();

    const newUser = this.userRepository.create({ id, ...createUserInput });

    return this.userRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOneByOrFail({ id: id });
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    return this.userRepository.save(updateUserInput);
  }

  async remove(id: string): Promise<User> {
    const user = await this.userRepository.findOneByOrFail({ id: id });
    console.log({ id });
    return this.userRepository.remove(user);
  }

  async getUsers(
    limit?: number,
    offset?: number,
    filter: any = {},
    sort: any = {},
    email?: string,
  ): Promise<[User[], number]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    console.log('Get users from ', email);
    // Apply filter
    if (filter && Object.keys(filter).length > 0) {
      Object.keys(filter).forEach((key) => {
        queryBuilder.andWhere(`user.${key} = :${key}`, { [key]: filter[key] });
      });
    }

    // Apply sorting
    if (sort && Object.keys(sort).length > 0) {
      Object.keys(sort).forEach((key) => {
        queryBuilder.orderBy(`user.${key}`, sort[key]);
      });
    }

    console.log({ limit, offset, filter, sort });
    // Apply pagination
    queryBuilder.skip(offset || 0).take(limit || 10);

    // Execute query and count total results
    const [users, count] = await queryBuilder.getManyAndCount();

    return [users, count];
  }

  async initUser() {
    const users = [];

    for (let i = 1; i <= 10; i++) {
      const user = new User();
      user.id = generate();
      user.email = faker.internet.email();
      user.password = await bcrypt.hash('1', 10);
      user.name = faker.name.fullName();
      user.phone = faker.phone.number();
      user.birthDay = faker.date
        .past(40, '2012-1-1')
        .toISOString()
        .slice(0, 10);
      user.gender = i % 2 === 0 ? 'nam' : 'nữ';
      users.push(user);
    }
    return await this.userRepository.insert(users);
    // return users;
  }
}
