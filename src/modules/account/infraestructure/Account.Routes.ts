import { Router } from 'express';
import { AccountController } from './Account.Controller';

export const accountRoutes = (accountController: AccountController): Router => {
  const router = Router();
  router.post('/accounts', (req, res) => accountController.createAccount(req, res));
  return router;
};
