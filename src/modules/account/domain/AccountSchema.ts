import { z } from 'zod';

export const AccountSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
