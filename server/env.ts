import * as z from 'zod';

// Define environment variables here
export const ServerEnv = z.object({
	PORT: z.coerce.number().int().positive().default(3000),
	SHOW_ROUTES: z.coerce.boolean().default(false),
	DEV_MODE: z.coerce.boolean().default(false),
	DATABASE_URL: z.url(),
	ECLIPSE_URL: z.url(),
	ECLIPSE_PASS: z.string().nonempty({ error: 'Eclipse Password cannot be blank' }),
	ORIGIN: z.url(),
	AUTH_SECRET: z.string().nonempty({ error: 'Auth Secret cannot be blank' }),
});
export type ServerEnv = z.infer<typeof ServerEnv>;

export const ProcessEnv = ServerEnv.parse(process.env);

declare module 'bun' {
	interface Env extends ServerEnv {
		[key: string]: string | undefined;
	}
}
