import { betterAuth } from 'better-auth';
import { Database } from 'bun:sqlite';
import { ProcessEnv } from '@server/env';
import { passkey } from 'better-auth/plugins/passkey';
import { admin } from 'better-auth/plugins/admin';

export const authDb = new Database('auth.db');

authDb.exec('PRAGMA journal_mode = WAL;');

export const auth = betterAuth({
	database: authDb,
	trustedOrigins: ['http://localhost:5000', ProcessEnv.ORIGIN],
	session: {
		freshAge: 0,
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		disableSignUp: true,
	},
	user: {},
	secret: ProcessEnv.AUTH_SECRET,
	baseUrl: ProcessEnv.ORIGIN,
	plugins: [
		passkey({
			rpID: ProcessEnv.PASSKEY_RP_ID,
			origin: ProcessEnv.PASSKEY_ORIGIN,
		}),
		admin(),
	],
});

export type AuthData = typeof auth.$Infer.Session;
