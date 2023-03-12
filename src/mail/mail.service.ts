import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail') private readonly mailQueue: Queue) {}

  async sendEmail() {
    await this.mailQueue.add('sendEmail', {
      file: 'audio.mp3',
    });
  }
  async validateEmail(email: string, otp: string) {
    // console.log(
    //   'job queue:',
    //   await this.mailQueue.getJobs([
    //     'completed',
    //     'waiting',
    //     'active',
    //     'delayed',
    //     'failed',
    //     'paused',
    //   ]),
    // );
    await this.mailQueue.add('sendEmail', {
      email: email,
      otp: otp,
    });
  }
}
