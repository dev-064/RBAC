import { z } from "zod";

export const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(["USER", "MODERATOR", "ADMIN"]).default("USER"),
  status: z.enum(["ACTIVE", "PENDING", "REJECTED"]).default("ACTIVE")
});

export type UserSchemaType = z.infer<typeof UserSchema>;
