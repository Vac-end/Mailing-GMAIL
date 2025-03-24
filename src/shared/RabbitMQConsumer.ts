// src/shared/RabbitMQConsumer.ts

import path from 'path';
import sequelize from './database/database';
import { SequelizeAccountRepository } from '../modules/account/infraestructure/SequelizeAccountRepository';
import { EmailService } from '../modules/email/application/EmailService';
import { SequelizeLeadRepository } from '../modules/email/infraestructure/SequelizeLeadRepository';
import { RabbitMQService } from './Messaging/RabbitMQ';

async function startConsumer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Base de datos sincronizada en el consumidor');
  } catch (error) {
    console.error('Error al sincronizar la base de datos en el consumidor:', error);
    process.exit(1);
  }
  
  const rabbit = RabbitMQService.getInstance();
  await rabbit.init();
  

  setTimeout(async () => {
    const channel = rabbit.getChannel();
    channel.prefetch(1);
    channel.consume("emailQueue", async (msg) => {
      if (msg) {
        console.log('Mensaje recibido de RabbitMQ:', msg.content.toString());
        const delayMs = Math.floor(Math.random() * (7000 - 3000 + 1)) + 10000;
        console.log(`Esperando ${delayMs} milisegundos para procesar el mensaje...`);
        setTimeout(async () => {
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
        }, delayMs);
      }
    }, { noAck: false });
    console.log("Suscripción al consumidor activada.");
  }, 10000);
}

startConsumer().catch(err => console.error('Error en consumidor:', err));
