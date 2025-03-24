import { Router } from 'express';
import { RabbitMQService } from '../../../shared/Messaging/RabbitMQ';

export const emailQueueRoutes = (): Router => {
  const router = Router();
  const rabbit = RabbitMQService.getInstance();

  router.post('/send-mail', async (req, res) => {
    try {
      await rabbit.publish("emailQueue", req.body);
      res.json({ success: true, message: 'Solicitud encolada correctamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al enviar a RabbitMQ', error });
    }
  });

  return router;
};
