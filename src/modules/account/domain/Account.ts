export interface Account {
  id: number;
  email: string;
  password: string;
  sentCount: number;
  blockedUntil?: Date;
}
