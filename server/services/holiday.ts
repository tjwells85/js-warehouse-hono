import { HolidayModel } from '@server/db/models';
import type { HolidaySchema, Holiday } from '@shared/types';
import { HTTPException } from 'hono/http-exception';

const purgeExpiredHolidays = async (): Promise<void> => {
	const now = new Date();
	await HolidayModel.deleteMany({ end: { $lt: now } });
};

export const getHolidays = async (): Promise<Holiday[]> => {
	await purgeExpiredHolidays();

	const holidays = await HolidayModel.find().sort({ start: 1 }).lean();
	return holidays;
};

export const getHoliday = async (id: string): Promise<Holiday> => {
	await purgeExpiredHolidays();

	const holiday = await HolidayModel.findById(id).lean();
	if (!holiday) {
		throw new HTTPException(404, { message: `Holiday with ID ${id} not found` });
	}

	return holiday;
};

export const addHoliday = async (holidayData: HolidaySchema): Promise<Holiday> => {
	const holiday = await HolidayModel.create(holidayData);
	return holiday.toObject();
};

export const updateHoliday = async (id: string, holidayData: Partial<HolidaySchema>): Promise<Holiday> => {
	const holiday = await HolidayModel.findByIdAndUpdate(id, holidayData, { new: true }).lean();
	if (!holiday) {
		throw new HTTPException(404, { message: `Holiday with ID ${id} not found` });
	}

	return holiday;
};

export const deleteHoliday = async (id: string): Promise<Holiday> => {
	const holiday = await HolidayModel.findByIdAndDelete(id).lean();
	if (!holiday) {
		throw new HTTPException(404, { message: `Holiday with ID ${id} not found` });
	}

	return holiday;
};
