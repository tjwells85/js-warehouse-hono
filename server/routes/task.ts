import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { TaskQuerySchema } from '@shared/types';
import type { HonoEnv } from '@server/lib/middleware';
import { superJsonResponse } from '@server/lib/utils/response';
import { getTasksForBranch } from '@server/services/task';

const taskRoutes = new Hono<HonoEnv>()
	/**
	 * GET /tasks/:branch - Get tasks for a branch with optional filtering
	 *
	 * Query parameters:
	 * - type: 'standard' | 'willcall' | 'transfers' | 'shipouts' | 'nonWillCall' | 'deliveries'
	 */
	.get('/:branch', zValidator('query', TaskQuerySchema), async (c) => {
		const branchId = c.req.param('branch');
		const { type } = c.req.valid('query');

		const result = await getTasksForBranch(branchId, type);

		return superJsonResponse(c, result);
	});

export default taskRoutes;
