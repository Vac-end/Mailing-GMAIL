import nodemailer from 'nodemailer';
import { Account } from '../../account/domain/Account';

export class NodemailerAdapter {
  private transporter: nodemailer.Transporter;
  private accountEmail: string;

  constructor(account: Account) {
    this.accountEmail = account.email;
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: account.email,
        pass: account.password,
      },
    });
  }
  
  async sendMail(to: string, subject: string, html: string) {
    const info = await this.transporter.sendMail({
      from: `"No Reply" <${this.accountEmail}>`,
      to,
      subject,
      html,
    });
    return info;
  }
}
