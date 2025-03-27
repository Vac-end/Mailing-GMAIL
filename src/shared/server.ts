import express from 'express';
import path from 'path';
import { accountRoutes } from '../modules/account/infraestructure/Account.Routes';
import { SequelizeAccountRepository } from '../modules/account/infraestructure/SequelizeAccountRepository';
import { SequelizeLeadRepository } from '../modules/email/infraestructure/SequelizeLeadRepository';
import { AccountService } from '../modules/account/application/AccountServices';
import { EmailService } from '../modules/email/application/EmailService';
import { AccountController } from '../modules/account/infraestructure/Account.Controller';
import { emailRoutes } from '../modules/email/infraestructure/Email.Routes';
import { EmailController } from '../modules/email/infraestructure/Email.Controller';
import { emailQueueRoutes } from '../modules/email/infraestructure/EmailQueue.Routes';

const app = express();
app.use(express.json());

const accountRepository = new SequelizeAccountRepository();
const leadRepository = new SequelizeLeadRepository();

const templatesPath = path.join(__dirname, './Template');

const accountService = new AccountService(accountRepository);
const emailService = new EmailService(accountRepository, leadRepository, templatesPath);

const accountController = new AccountController(accountService);
const emailController = new EmailController(emailService);

app.use(accountRoutes(accountController));
app.use(emailRoutes(emailController));
app.use(emailQueueRoutes());


export default app;
