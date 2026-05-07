import { z } from 'zod/v4';
import type { PortfolioDictionary } from '@/features/portfolio/i18n/types';

type AdminLoginCopy = PortfolioDictionary['admin'];

export function createAdminLoginFormSchema(copy: AdminLoginCopy) {
  return z.object({
    email: z.email(copy.emailValidation),
    password: z.string().min(8, copy.passwordValidation),
  });
}

export type AdminLoginFormValues = z.infer<ReturnType<typeof createAdminLoginFormSchema>>;
