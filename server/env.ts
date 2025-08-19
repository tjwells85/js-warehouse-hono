import * as z from 'zod';

// Define environment variables here
export const ServerEnv = z.object({
	PORT: z.coerce.number().int().positive().default(3000),
	SHOW_ROUTES: z.coerce.boolean().default(false),
	DEV_MODE: z.coerce.boolean().default(false),
	DATABASE_URL: z.url(),
	ECLIPSE_URL: z.url(),
	ECLIPSE_USER: z.string().nonempty({ error: 'Eclipse User cannot be blank' }),
	ECLIPSE_PASS: z.string().nonempty({ error: 'Eclipse Password cannot be blank' }),
	ORIGIN: z.url(),
	AUTH_SECRET: z.string().nonempty({ error: 'Auth Secret cannot be blank' }),
	PASSKEY_RP_ID: z.string().nonempty({ error: 'Passkey RP ID cannot be blank' }),
	PASSKEY_ORIGIN: z.url().nonempty({ error: 'Passkey Origin cannot be blank' }),
	DEFAULT_ADMIN_EMAIL: z.email().nonempty({ error: 'Default Admin Email cannot be blank' }),
	DEFAULT_ADMIN_PASSWORD: z.string().min(8).nonempty({ error: 'Default Admin Password cannot be blank' }),
	DEFAULT_ADMIN_NAME: z.string().default('Administrator'),
});
export type ServerEnv = z.infer<typeof ServerEnv>;

export const ProcessEnv = ServerEnv.parse(process.env);

declare module 'bun' {
	interface Env extends ServerEnv {
		[key: string]: string | undefined;
	}
}
