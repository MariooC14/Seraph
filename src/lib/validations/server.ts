import * as z from "zod";

export const serverSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  host: z.string().min(1, "Host is required"),
  port: z.number().int().min(1).max(65535).default(22),
  username: z.string().min(1, "Username is required"),
  privateKey: z.string().min(1, "Private key is required"),
});

export type ServerFormData = z.infer<typeof serverSchema>;
