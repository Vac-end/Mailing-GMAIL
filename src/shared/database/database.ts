import { Sequelize } from 'sequelize-typescript';
import { dbConfig } from './config';
import { AccountModel } from '../../modules/account/infraestructure/Account.Model';
import { LeadModel } from '../../modules/email/infraestructure/Lead.Model';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  models: [AccountModel, LeadModel],
  logging: false,
});

export default sequelize;
