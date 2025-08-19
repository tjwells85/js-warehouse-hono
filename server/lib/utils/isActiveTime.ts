import { HolidayModel } from '@server/db/models';
import { isSunday, isSaturday } from 'date-fns';

export const isActiveTime = async (now = new Date()): Promise<boolean> => {
	// Check if Sunday. Never open on sundays
	if (isSunday(now) || isSaturday(now)) {
		return false;
	}

	// Check if current day lands in a holiday
	const holiday = await HolidayModel.findOne({
		start: { $lte: now },
		end: { $gte: now },
	}).lean();

	if (holiday) {
		return false;
	}

	return true;
};
