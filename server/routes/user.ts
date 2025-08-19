import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { HonoEnv } from '@server/lib/middleware';
import { requireAdmin } from '@server/lib/middleware';
import { superJsonResponse } from '@server/lib/utils/response';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '@server/services/user';
import { UserSchema } from '@shared/types';

const userRoutes = new Hono<HonoEnv>()
	// Apply authentication to all user routes
	.use('*', requireAdmin)
	/**
	 * GET /users - Get all users (admin only)
	 */
	.get('/', async (c) => {
		const users = await getAllUsers();
		return superJsonResponse(c, users);
	})

	/**
	 * GET /users/:id - Get user by ID (admin only)
	 */
	.get('/:id', async (c) => {
		const id = c.req.param('id');
		const user = await getUserById(id);
		return superJsonResponse(c, user);
	})

	/**
	 * POST /users - Create new user (admin only)
	 */
	.post('/', zValidator('json', UserSchema), async (c) => {
		const data = c.req.valid('json');
		const user = await createUser(data);
		return superJsonResponse(c, user, 201);
	})

	/**
	 * PUT /users/:id - Update user (admin only)
	 */
	.put('/:id', zValidator('json', UserSchema), async (c) => {
		const id = c.req.param('id');
		const data = c.req.valid('json');
		const user = await updateUser(id, data);
		return superJsonResponse(c, user);
	})

	/**
	 * DELETE /users/:id - Delete user (admin only)
	 */
	.delete('/:id', async (c) => {
		const id = c.req.param('id');
		const result = await deleteUser(id);
		return superJsonResponse(c, result);
	});

export default userRoutes;
