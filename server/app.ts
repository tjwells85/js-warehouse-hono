import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import apiRoutes from './routes';
import { logger } from 'hono/logger';
import { showRoutes } from 'hono/dev';
import { ProcessEnv } from './env';

const app = new Hono();

app.use('*', logger());

app.route('/', apiRoutes);

app.get('/*', serveStatic({ root: './build/client' }));
app.use('*', serveStatic({ path: './build/client/index.html' }));

if (ProcessEnv.SHOW_ROUTES) {
	showRoutes(app);
}

export type ApiRoutes = typeof apiRoutes;
export default app;
