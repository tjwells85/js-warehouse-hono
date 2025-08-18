import app from './app';
import { ProcessEnv } from './env';
import { init } from './lib/init';

await init();

const server = Bun.serve({
	port: ProcessEnv.PORT,
	hostname: '0.0.0.0',
	fetch: app.fetch,
	development: ProcessEnv.DEV_MODE,
});

console.log(`Server running on port ${server.port}`);
