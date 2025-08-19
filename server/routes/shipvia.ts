import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { ShipViaSchema, ShipViaType } from '@shared/types';
import type { HonoEnv } from '@server/lib/middleware';
import { superJsonResponse } from '@server/lib/utils/response';
import { getAllShipVias, getShipViaById, getShipViaByName, getShipViasByType, createShipVia, updateShipVia, updateShipViaByName, deleteShipVia } from '@server/services/shipvia';
import { HTTPException } from 'hono/http-exception';

const shipViaRoutes = new Hono<HonoEnv>()
	/**
	 * GET /shipvias - Get all ship vias, optionally filtered by type
	 */
	.get('/', async (c) => {
		const type = c.req.query('type') as 'WillCall' | 'Delivery' | 'ShipOut' | undefined;

		if (type && ShipViaType.options.includes(type)) {
			const shipVias = await getShipViasByType(type);
			return superJsonResponse(c, shipVias);
		}

		const shipVias = await getAllShipVias();
		return superJsonResponse(c, shipVias);
	})

	/**
	 * GET /shipvias/:id - Get ship via by ID (auto-detects MongoDB ID vs name)
	 */
	.get('/:id', async (c) => {
		const id = c.req.param('id');

		// Check if it's a MongoDB ObjectId (24 hex characters)
		const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

		let shipVia;
		if (isMongoId) {
			shipVia = await getShipViaById(id);
		} else {
			// Assume it's a ship via name
			shipVia = await getShipViaByName(decodeURIComponent(id));
		}

		return superJsonResponse(c, shipVia);
	})

	/**
	 * POST /shipvias - Create new ship via
	 */
	.post('/', zValidator('json', ShipViaSchema), async (c) => {
		const data = c.req.valid('json');
		const shipVia = await createShipVia(data);
		return superJsonResponse(c, shipVia, 201);
	})

	/**
	 * PUT /shipvias/:id - Update ship via by ID (auto-detects MongoDB ID vs name)
	 */
	.put('/:id', zValidator('json', ShipViaSchema.partial()), async (c) => {
		const id = c.req.param('id');
		const data = c.req.valid('json');

		// Check if it's a MongoDB ObjectId
		const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

		let shipVia;
		if (isMongoId) {
			shipVia = await updateShipVia(id, data);
		} else {
			// Update by name
			shipVia = await updateShipViaByName(decodeURIComponent(id), data);
		}

		return superJsonResponse(c, shipVia);
	})

	/**
	 * DELETE /shipvias/:id - Delete ship via by ID (MongoDB ID only for safety)
	 */
	.delete('/:id', async (c) => {
		const id = c.req.param('id');

		// Check if it's a MongoDB ObjectId
		const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

		if (!isMongoId) {
			throw new HTTPException(400, {
				message: 'Delete operations require MongoDB ObjectId, not ship via name',
			});
		}

		await deleteShipVia(id);
		return superJsonResponse(c, { message: 'Ship via deleted successfully' });
	});

export default shipViaRoutes;
