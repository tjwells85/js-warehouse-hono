import type { Task } from '@shared/types';
import { getLocalDate } from './getLocalDate';
import { round } from './round';

export const getAdjustedTime = (task: Task): number => {
	const active = task.activeTime * 1000;
	const createdAt = getLocalDate(task.createdAt).getTime();
	const lastSeen = getLocalDate(task.lastSeen).getTime();
	const diff = lastSeen - createdAt;
	const inactive = diff - active;
	return round((diff - inactive) / 1000, 1);
};
