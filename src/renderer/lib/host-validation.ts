import { z } from 'zod';
export const hostFormSchema = z.object({
  label: z.string(),
  host: z.string().min(1, 'Host is required'),
  port: z
    .number()
    .gte(1, 'Port must be greater than 0')
    .nonnegative('Port must be a non-negative number')
    .lt(65536, 'Port must be less than 65536')
    .optional(),
  username: z.string(),
  password: z.string(),
  privateKey: z.string()
});

export type HostFormData = z.infer<typeof hostFormSchema>;
