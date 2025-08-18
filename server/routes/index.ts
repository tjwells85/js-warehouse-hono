import { Hono } from 'hono';

import helloRoute from './hello';

const apiRoutes = new Hono().basePath('/api').route('/hello', helloRoute);

export default apiRoutes;
