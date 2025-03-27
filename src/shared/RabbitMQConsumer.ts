// src/shared/RabbitMQConsumer.ts

import path from 'path';
import { SequelizeAccountRepository } from '../modules/account/infraestructure/SequelizeAccountRepository';
import { EmailService } from '../modules/email/application/EmailService';
import { SequelizeLeadRepository } from '../modules/email/infraestructure/SequelizeLeadRepository';
import { RabbitMQService } from './Messaging/RabbitMQ';

export async function startConsumer() {
  
  const rabbit = RabbitMQService.getInstance();
  await rabbit.init();
  

  const channel = rabbit.getChannel();
    channel.prefetch(1);
    channel.consume("emailQueue", async (msg) => {
      if (msg) {
        console.log('Mensaje recibido de RabbitMQ:', msg.content.toString());
        const delayMs = Math.floor(Math.random() * (7000 - 3000 + 1)) + 10000;
        console.log(`Esperando ${delayMs} milisegundos para procesar el mensaje...`);
        try {
          const accountRepository = new SequelizeAccountRepository();
          const leadRepository = new SequelizeLeadRepository();
          const templatesPath = path.join(__dirname, 'Template');
          const emailService = new EmailService(accountRepository, leadRepository, templatesPath);
          const result = await emailService.sendEmail(JSON.parse(msg.content.toString()));

          if(!result.success && result.message.includes('Cuenta no válida')){
            console.warn('No hgay cuentas disponibles. Reintentando en unos segundos... ');
            channel.nack(msg, false, true);
            return;
          }
          console.log('Resultado del envío:', result);
          channel.ack(msg);
        } catch (error) {
          console.error('Error al procesar el mensaje:', error);
          channel.nack(msg, false, true);
        }
      }
    }, { noAck: false });
    console.log("Suscripción al consumidor activada.");
}


