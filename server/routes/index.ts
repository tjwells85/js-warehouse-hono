import { Hono } from 'hono';
import { useSession } from '@server/lib/middleware';

import authRoutes from './auth';
import branchRoutes from './branch';
import taskRoutes from './task';
import shipViaRoutes from './shipvia';
import userRoutes from './user';

const apiRoutes = new Hono()
	.basePath('/api')
	.use(useSession)
	.route('/auth', authRoutes)
	.route('/branches', branchRoutes)
	.route('/tasks', taskRoutes)
	.route('/shipvias', shipViaRoutes)
	.route('/users', userRoutes);

export default apiRoutes;
