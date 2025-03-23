import { AccountRepository } from '../domain/AccountRepository';
import { Account } from '../domain/Account';
import { AccountModel } from './Account.Model';
import { fn } from 'sequelize';

export class SequelizeAccountRepository implements AccountRepository {
  async getRandomAccount(): Promise<Account | null> {
    const randomAccount = await AccountModel.findOne({
      order: [[fn('RAND'), 'ASC']]
    });
    if (randomAccount) {
      return randomAccount.get({ plain: true }) as Account;
    }
    return null;
  }

  async incrementSentCount(accountId: number): Promise<void> {
    await AccountModel.increment('sentCount', { where: { id: accountId } });
  }

  async create(account: Account): Promise<Account> {
    const createdAccount = await AccountModel.create(account as any);
    return createdAccount.get({ plain: true }) as Account;
  }

  async blockAccount(accountId: number, blockedUntil: Date): Promise<void> {
    await AccountModel.update({ blockedUntil }, { where: { id: accountId } });
  }
}
