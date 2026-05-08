import { z } from 'zod';

export const memberRoleOptions = ['member', 'leader', 'treasurer', 'admin', 'super_admin'] as const;

export const memberSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  birth_date: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  marital_status: z.enum(['single', 'married', 'divorced', 'widowed', 'separated']).optional(),
  address: z.string().optional(),
  address_city: z.string().optional(),
  address_state: z.string().optional(),
  baptism_date: z.string().optional(),
  conversion_date: z.string().optional(),
  department_id: z.string().optional(),
  status: z.boolean().default(true),
  avatar_url: z.string().optional(),
  family_group_id: z.string().optional(),
  new_family_group_name: z.string().optional(),
  role: z.enum(memberRoleOptions).optional(),
  role_start_date: z.string().optional(),
});

export type MemberFormData = z.infer<typeof memberSchema>;

export const memberDbSchema = memberSchema.omit({ family_group_id: true, new_family_group_name: true, role: true, role_start_date: true });
export type MemberDbData = z.infer<typeof memberDbSchema>;
