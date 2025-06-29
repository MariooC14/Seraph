import { z } from 'zod';
export const hostFormSchema = z
  .object({
    label: z.string().min(1, 'Label is required'),
    host: z.string().min(1, 'Host is required'),
    port: z
      .string()
      .min(1, 'Port is required')
      .refine(val => {
        const num = Number(val);
        return !isNaN(num) && num >= 1 && num <= 65535;
      }, 'Port must be a number between 1 and 65535'),
    username: z.string().min(1, 'Username is required'),
    password: z.string().optional(),
    privateKey: z.string().optional()
  })
  .refine(
    data => {
      return data.password || data.privateKey;
    },
    {
      message: 'Either password or private key is required',
      path: ['password']
    }
  );

export type HostFormData = z.infer<typeof hostFormSchema>;

export type HostSubmissionData = {
  label: string;
  host: string;
  port: number;
  username: string;
};
