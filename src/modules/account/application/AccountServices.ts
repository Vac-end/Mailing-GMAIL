import { Account } from '../domain/Account';
import { AccountRepository } from '../domain/AccountRepository';
import { AccountSchema } from '../domain/AccountSchema';

export class AccountService {
  constructor(private accountRepository: AccountRepository) {}

  async createAccount(accountData: Omit<Account, 'id' | 'sentCount'>): Promise<Account> {
    AccountSchema.parse(accountData);
    const newAccount: Omit<Account, 'id'> = {
      ...accountData,
      sentCount: 0,
    };
    return await this.accountRepository.create(newAccount as Account);
  }
}
