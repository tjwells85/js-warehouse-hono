import * as z from 'zod';
import type { AuthData } from '@server/lib/auth';

export type User = AuthData['user'];
export type Session = AuthData['session'];

export const UserRole = z.enum(['admin', 'user']);
export type UserRole = z.infer<typeof UserRole>;

export const UserSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
	name: z.string(),
	role: UserRole.default('user'),
	banned: z.boolean().optional(),
	banReason: z.string().optional(),
	banExpires: z.coerce.date().optional(),
});
export type UserSchema = z.infer<typeof UserSchema>;
