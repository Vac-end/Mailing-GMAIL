import { Router } from 'express';
import { EmailController } from './Email.Controller';

export const emailRoutes = (emailController: EmailController): Router => {
  const router = Router();
  router.post('/send-mail-direct', (req, res) => emailController.sendEmail(req, res));
  return router;
};
