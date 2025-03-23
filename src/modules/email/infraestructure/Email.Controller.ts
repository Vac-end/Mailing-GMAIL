import { Request, Response } from 'express';
import { EmailService } from '../application/EmailService';

export class EmailController {
  constructor(private emailService: EmailService) {}

  async sendEmail(req: Request, res: Response): Promise<void> {
    const payload = req.body;
    if (!payload.email || !payload.Template) {
      res.status(400).json({ success: false, message: 'El correo y la plantilla son obligatorios' });
      return;
    }
    try {
      const result = await this.emailService.sendEmail(payload);
      if (result.success) {
        res.json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al enviar el correo', error });
    }
  }
}
