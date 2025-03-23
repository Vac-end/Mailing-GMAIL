import { Request, Response } from 'express';
import { AccountService } from '../application/AccountServices';

export class AccountController {
  constructor(private accountService: AccountService) {}

  async createAccount(req: Request, res: Response): Promise<void> {
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'El email y la contraseña son obligatorios' });
      return;
    }
    try {
      const account = await this.accountService.createAccount({ email, password });
      res.status(201).json({ success: true, account });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al crear la cuenta', error });
    }
  }
}
