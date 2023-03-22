import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { CommonModule } from './common/common.module';
import { MovieModule } from './movie/movie.module';
import { CinemaModule } from './cinema/cinema.module';
import { FoodModule } from './food/food.module';
import { TicketModule } from './ticket/ticket.module';
import { ShowtimeModule } from './showtime/showtime.module';
import { ProvinceModule } from './province/province.module';
import { AdminModule } from './admin/admin.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB,
      port: 5432,
      username: 'postgres',
      password: 'mysecretpassword',
      database: 'bts',
      entities: [join(__dirname, '**/*.entity{.ts,.js}')],
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    UserModule,
    AuthModule,
    MailModule,
    CommonModule,
    MovieModule,
    CinemaModule,
    FoodModule,
    TicketModule,
    ShowtimeModule,
    ProvinceModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
