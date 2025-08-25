import { Hono } from 'hono';
import { type HonoEnv, requireAdmin } from '@server/lib/middleware';
import { zValidator } from '@hono/zod-validator';
import { HolidaySchema } from '@shared/types';
import { superJsonResponse } from '@server/lib/utils/response';
import { getHolidays, getHoliday, addHoliday, updateHoliday, deleteHoliday } from '@server/services/holiday';

const holidayRoutes = new Hono<HonoEnv>()
	.use(requireAdmin)
	.get('/', async (c) => {
		const holidays = await getHolidays();
		return superJsonResponse(c, holidays);
	})
	.get('/:id', async (c) => {
		const holiday = await getHoliday(c.req.param('id'));
		return superJsonResponse(c, holiday);
	})
	.post('/', zValidator('json', HolidaySchema), async (c) => {
		const holiday = await addHoliday(c.req.valid('json'));
		return superJsonResponse(c, holiday);
	})
	.put('/:id', zValidator('json', HolidaySchema.partial()), async (c) => {
		const holiday = await updateHoliday(c.req.param('id'), c.req.valid('json'));
		return superJsonResponse(c, holiday);
	})
	.delete('/:id', async (c) => {
		const holiday = await deleteHoliday(c.req.param('id'));
		return superJsonResponse(c, holiday);
	});

export default holidayRoutes;
