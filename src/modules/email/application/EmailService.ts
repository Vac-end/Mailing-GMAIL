// src/modules/email/application/EmailService.ts
import { AccountRepository } from '../../account/domain/AccountRepository';
import { LeadRepository } from '../domain/LeadRepository';
import { NodemailerAdapter } from '../infraestructure/NodemailerAdapter';
import { readFile } from 'fs/promises';
import path from 'path';
import { EmailSchema } from '../domain/EmailSchema';

type SendEmailPayload = {
  email: string;
  Template: "Generic" | "General";
  image_url?: string;
  document_url?: string;
  video_url?: string;
  wsp_url?: string;
  page_url?: string;
  fb_url?: string;
};

export class EmailService {
  constructor(
    private accountRepository: AccountRepository,
    private leadRepository: LeadRepository,
    private templatesPath: string
  ) {}

  async sendEmail(payload: SendEmailPayload): Promise<{ success: boolean; message: string }> {
    EmailSchema.parse(payload);

    const account = await this.accountRepository.getRandomAccount();
    if (!account || account.id === undefined) {
      return { success: false, message: 'Cuenta no válida para el envío' };
    }

    const now = new Date();
    if (account.blockedUntil && new Date(account.blockedUntil!) > now) {
      return { success: false, message: 'La cuenta se encuentra bloqueada por exceso de envíos' };
    }    

    if (account.sentCount >= 500) {
      const nextDay8am = new Date(now);
      nextDay8am.setDate(now.getDate() + 1);
      nextDay8am.setHours(8, 0, 0, 0);

      const blockUntil = now.getHours() < 8 ? nextDay8am : new Date(now.getTime() + 24 * 60 * 60 * 1000);
      await this.accountRepository.blockAccount(account.id, blockUntil);
      return { success: false, message: 'La cuenta se encuentra bloqueada por exceso de envíos' };
    }

    console.log('Cuenta de envío seleccionada:', account.email);

    const templateFile = `${payload.Template}.html`;
    const templatePath = path.join(this.templatesPath, templateFile);
    let html: string;
    try {
      html = await readFile(templatePath, 'utf-8');
    } catch (err) {
      return { success: false, message: 'Error al leer la plantilla de correo' };
    }

    html = html.replace(/{{\s*(\w+)\s*}}/g, (_: string, p1: string) => {
      return (payload as any)[p1] || '';
    });    

    const mailer = new NodemailerAdapter(account);
    try {
      await mailer.sendMail(payload.email, 'Asunto del correo', html);
      await this.accountRepository.incrementSentCount(account.id);
      await this.leadRepository.create({
        email: payload.email,
        status: 'sent',
        accountId: account.id
      });
      return { success: true, message: 'Correo enviado correctamente' };
    } catch (err) {
      await this.leadRepository.create({
        email: payload.email,
        status: 'failed',
        accountId: account.id
      });
      return { success: false, message: 'Error al enviar el correo' };
    }
  }
}
