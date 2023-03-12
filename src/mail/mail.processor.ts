import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('mail')
export class MailProcessor {
  constructor(private mailerService: MailerService) {}

  @Process('sendEmail')
  async sendEmail(job: Job) {
    await this.mailerService.sendMail({
      to: job.data.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to UIT cinema! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        otp: job.data.otp,
      },
    });
  }
}
