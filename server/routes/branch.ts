import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { BranchSchema } from '@shared/types';
import type { HonoEnv } from '@server/lib/middleware';
import { getAllBranches, getBranchById, getBranchByBrId, createBranch, updateBranch, deleteBranch } from '@server/services/branch';
import { superJsonResponse } from '@server/lib/utils/response';

const branchRoutes = new Hono<HonoEnv>()
	/**
	 * GET /branches - Get all branches
	 */
	.get('/', async (c) => {
		const branches = await getAllBranches();
		return superJsonResponse(c, branches);
	})

	/**
	 * GET /branches/:id - Get branch by ID (auto-detects MongoDB ID vs brId)
	 */
	.get('/:id', async (c) => {
		const id = c.req.param('id');

		// Check if it's a MongoDB ObjectId (24 hex characters)
		const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

		let branch;
		if (isMongoId) {
			branch = await getBranchById(id);
		} else {
			// Assume it's a brId (like "1", "2", "4", etc.)
			branch = await getBranchByBrId(id);
		}

		return superJsonResponse(c, branch);
	})

	/**
	 * POST /branches - Create new branch
	 */
	.post('/', zValidator('json', BranchSchema), async (c) => {
		const data = c.req.valid('json');
		const branch = await createBranch(data);

		return superJsonResponse(c, branch, 201); // 201 Created
	})

	/**
	 * PUT /branches/:id - Update branch by ID (auto-detects MongoDB ID vs brId)
	 */
	.put('/:id', zValidator('json', BranchSchema.partial()), async (c) => {
		const id = c.req.param('id');
		const data = c.req.valid('json');

		// Check if it's a MongoDB ObjectId
		const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

		let branch;
		if (isMongoId) {
			branch = await updateBranch(id, data);
		} else {
			// Find by brId first, then update by MongoDB ID
			const existingBranch = await getBranchByBrId(id);
			branch = await updateBranch(existingBranch._id, data);
		}

		return superJsonResponse(c, branch);
	})

	/**
	 * DELETE /branches/:id - Delete branch by ID (auto-detects MongoDB ID vs brId)
	 */
	.delete('/:id', async (c) => {
		const id = c.req.param('id');

		// Check if it's a MongoDB ObjectId
		const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

		let branch;
		if (isMongoId) {
			branch = await deleteBranch(id);
		} else {
			// Find by brId first, then delete by MongoDB ID
			const existingBranch = await getBranchByBrId(id);
			branch = await deleteBranch(existingBranch._id);
		}

		return superJsonResponse(c, branch);
	});

export default branchRoutes;
