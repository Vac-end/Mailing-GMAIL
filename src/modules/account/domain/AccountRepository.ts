import { Account } from './Account';

export interface AccountRepository {
  getRandomAccount(): Promise<Account | null>;
  incrementSentCount(accountId: number): Promise<void>;
  create(account: Account): Promise<Account>;
  blockAccount(accountId: number, blockedUntil: Date): Promise<void>;
}
