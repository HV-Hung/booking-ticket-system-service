import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Showtime } from "src/showtime/entities/showtime.entity";
import { Ticket } from "src/ticket/entities/ticket.entity";
import { User } from "src/user/entities/user.entity";
import { IsNull, Repository } from "typeorm";



@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    @InjectRepository(Showtime) private showtimeRepository: Repository<Showtime>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  async getTotalLatestMonth() {
    console.log("this month is: ");
    const currentMonth = new Date().getMonth();

    const latestMonth = currentMonth - 1;

    const totalTicket = await this.ticketRepository
      .createQueryBuilder('ticket')
      .where('MONTH(ticket.createdAt) = :latestMonth', { latestMonth })
      .select('SUM(ticket.totalTicket)')
      .getRawMany();

    const totalFood = await this.ticketRepository
      .createQueryBuilder('ticket')
      .where('MONTH(ticket.createdAt) = :latestMonth', { latestMonth })
      .select('SUM(ticket.totalFood)')
      .getRawMany();

    const total = +totalTicket + +totalFood;

    console.log(total);

    return total;
  }


  async getTotalAllTime() {
    //console.log('total');

    const totalTicket = await this.ticketRepository
      .createQueryBuilder('ticket')
      .select('SUM(ticket.totalTicket)')
      .getRawOne();

    const totalFood = await this.ticketRepository
      .createQueryBuilder('ticket')
      .select('SUM(ticket.totalFood)')
      .getRawOne();

    const total = parseInt(totalTicket.sum) + parseInt(totalFood.sum);

    //console.log(totalTicket);
    //console.log(totalFood);

    return total;
  }


  async getTotalEachMonth(year: Number) {

    const monthlyTotalTicket = [];
    for (let month = 1; month <= 12; month++) {
      let fromDate = `${year}-${month}-01`;
      let toDate = `${year}-${month}-31`;

      if (month == 2) {
        fromDate = `${year}-${month}-01`;
        toDate = `${year}-${month}-28`;
      }
      else if (month == 4 || month == 6 || month == 9 || month == 11) {
        fromDate = `${year}-${month}-01`;
        toDate = `${year}-${month}-30`;
      }

      const total = await this.ticketRepository
        .createQueryBuilder('ticket')
        .select(`sum(ticket.totalTicket)`, 'total')
        .addSelect(`'${month}'`, 'month')
        .where(`ticket.createdAt >= '${fromDate}' and ticket.createdAt <= '${toDate}'`)
        .getRawOne();
      monthlyTotalTicket.push(total);
    }

    const monthlyTotalFood = [];
    for (let month = 1; month <= 12; month++) {
      let fromDate = `${year}-${month}-01`;
      let toDate = `${year}-${month}-31`;

      if (month == 2) {
        fromDate = `${year}-${month}-01`;
        toDate = `${year}-${month}-28`;
      }
      else if (month == 4 || month == 6 || month == 9 || month == 11) {
        fromDate = `${year}-${month}-01`;
        toDate = `${year}-${month}-30`;
      }

      const total = await this.ticketRepository
        .createQueryBuilder('ticket')
        .select(`sum(ticket.totalFood)`, 'total')
        .addSelect(`'${month}'`, 'month')
        .where(`ticket.createdAt >= '${fromDate}' and ticket.createdAt <= '${toDate}'`)
        .getRawOne();
      monthlyTotalFood.push(total);
    }

    const monthlyTotal = [];
    for (let month = 1; month <= 12; month++) {
      const totalTicket = monthlyTotalTicket[month - 1].total;
      const totalFood = monthlyTotalFood[month - 1].total;
      const total = parseInt(totalTicket) + parseInt(totalFood);
      monthlyTotal.push({"month": month, "total": total});
    }

    return monthlyTotal;
  }

  async getCountUser() {
    return this.userRepository.createQueryBuilder('user')
      .where('user.deletedAt Is Null')//ngược lại là Is Not Null
      .getCount();
  }

}
