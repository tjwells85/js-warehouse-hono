import { auth } from '@server/lib/auth';
import type { User, Session } from '@shared/types';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

export type HonoEnv<Req extends boolean = false> = {
	Variables: {
		user: Req extends true ? User : User | null;
		session: Req extends true ? Session : Session | null;
	};
};

export const useSession = createMiddleware<HonoEnv>(async (c, next) => {
	const authSession = await auth.api.getSession({ headers: c.req.raw.headers });

	const session = authSession?.session ?? null;
	const user = authSession?.user ?? null;

	c.set('session', session);
	c.set('user', user as User | null);

	return next();
});

export const requireUser = createMiddleware<HonoEnv<true>>(async (c, next) => {
	const user = c.get('user');
	const session = c.get('session');

	if (!user || !session) {
		throw new HTTPException(401, { message: 'Unauthorized' });
	}

	if (user.banned) {
		throw new HTTPException(403, { message: 'User is banned' });
	}

	return next();
});

export const requireAdmin = createMiddleware<HonoEnv<true>>(async (c, next) => {
	const user = c.get('user');
	const session = c.get('session');

	if (!user || !session) {
		throw new HTTPException(401, { message: 'Unauthorized' });
	}

	if (user.banned) {
		throw new HTTPException(403, { message: 'User is banned' });
	}

	if (user.role !== 'admin') {
		throw new HTTPException(403, { message: 'User is not an admin' });
	}

	return next();
});
