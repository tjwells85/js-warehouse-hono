import { Hono } from 'hono';
import { useSession } from '@server/lib/middleware';

import authRoutes from './auth';
import branchRoutes from './branch';
import holidayRoutes from './holiday';
import shipViaRoutes from './shipvia';
import taskRoutes from './task';
import userRoutes from './user';

const apiRoutes = new Hono()
	.basePath('/api')
	.use(useSession)
	.route('/auth', authRoutes)
	.route('/branches', branchRoutes)
	.route('/holidays', holidayRoutes)
	.route('/shipvias', shipViaRoutes)
	.route('/tasks', taskRoutes)
	.route('/users', userRoutes);

export default apiRoutes;
