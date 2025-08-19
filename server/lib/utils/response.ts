import superjson from 'superjson';
import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

export const superJsonResponse = <T = unknown>(c: Context, data: T, status: ContentfulStatusCode = 200) => {
	const serialized = superjson.serialize(data);
	return c.json(serialized, status);
};
