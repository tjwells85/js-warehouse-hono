import { hc } from 'hono/client';
import type { ApiRoutes } from '@server/app';

/*
  If you need to add headers every time, like a token for instance, you can do it like this:

  const client = () => hc<ApiRoutes>('/', { headers: getHeaders() }).api;

  export default client;
*/

export const apiClient = hc<ApiRoutes>('/').api;
