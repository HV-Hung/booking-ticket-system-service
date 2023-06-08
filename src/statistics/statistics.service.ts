import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { count } from "console";
import { Cinema } from "src/cinema/entities/cinema.entity";
import { Showtime } from "src/showtime/entities/showtime.entity";
import { Ticket } from "src/ticket/entities/ticket.entity";
import { User } from "src/user/entities/user.entity";
import { IsNull, Repository } from "typeorm";



@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    @InjectRepository(Showtime) private showtimeRepository: Repository<Showtime>,
    @InjectRepository(Cinema) private cinemaRepository: Repository<Cinema>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  async getTotalAllTime() {
    const totalTicket = await this.ticketRepository
      .createQueryBuilder('ticket')
      .select('SUM(ticket.totalTicket)')
      .getRawOne();

    const totalFood = await this.ticketRepository
      .createQueryBuilder('ticket')
      .select('SUM(ticket.totalFood)')
      .getRawOne();

    const total = parseInt(totalTicket.sum) + parseInt(totalFood.sum);

    return {"TotalAllTime": total};
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
      const total = (parseInt(totalTicket) + parseInt(totalFood)) ;
      if(Number.isNaN(total)){
        monthlyTotal.push({"month": month, "total": 0});
      }
      else{
        monthlyTotal.push({"month": month, "total": total});
      }
    }

    return monthlyTotal;
  }

  async getCountUser() {
    const countUser = await this.userRepository.createQueryBuilder('user')
      .where('user.deletedAt Is Null')//ngược lại là Is Not Null
      .getCount();

      var json = {
        CountUser: countUser
      }
      return json;
  }

  async getCountTicket() {
    const countTicket = await this.ticketRepository.createQueryBuilder('ticket')
      .getCount();

      var json = {
        CountTicket: countTicket
      }
      return json;
  }

  async getLatestTicket() {
    const recentTickets = await this.ticketRepository.find({
      order: { createdAt: 'DESC' },
      take: 6,
    });;

    return {"RecentTickets": recentTickets};
  }

  async getCountCinema() {
    const countTicket = await this.cinemaRepository.find({
      where:{
        deleteAt: IsNull(),
      }
    });

    return {"CountCinema": countTicket.length.toString()};
  }
}