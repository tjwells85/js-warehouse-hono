import { Hono } from 'hono';
import { type HonoEnv } from '@server/lib/middleware';
import { auth } from '@server/lib/auth';
import { ProcessEnv } from '@server/env';
import { cors } from 'hono/cors';

const authRouter = new Hono<HonoEnv>()
	.use(
		cors({
			origin: ProcessEnv.ORIGIN,
			allowHeaders: ['Content-Type', 'Authorization'],
			allowMethods: ['GET', 'POST', 'OPTIONS'],
			exposeHeaders: ['Content-Length'],
			maxAge: 600,
			credentials: true,
		})
	)
	.on(['POST', 'GET'], '/*', async (c) => {
		return auth.handler(c.req.raw);
	});

export default authRouter;
