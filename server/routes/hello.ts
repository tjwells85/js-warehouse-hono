import { Hono } from 'hono';

const helloRoute = new Hono().get('/', async (c) => {
	return c.json({ message: 'Hello, World!' });
});

export default helloRoute;
