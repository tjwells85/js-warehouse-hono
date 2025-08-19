import type { Stat, StatSchema, ShipViaStat, ShipVia, ShipViaType } from '@shared/types';
import type { TaskMergeResult } from './handleMerge';
import { round } from '@shared/utils';
import { startOfDay, endOfDay, subYears, addYears, format } from 'date-fns';

// Eclipse API PickTask interface
interface PickTask {
	orderId: string;
	shipVia: string;
	pickPriority: string;
	[key: string]: any;
}

export interface ParsedStats {
	branch: string;
	period: {
		start: Date;
		end: Date;
	};
	overall: {
		min: number;
		max: number;
		total: number;
		closed: number;
		added: number;
		dailyNet: number;
	};
	salesOrders: {
		min: number;
		max: number;
		total: number;
	};
	transfers: {
		min: number;
		max: number;
		total: number;
	};
	purchases: {
		min: number;
		max: number;
		total: number;
	};
	shipOuts: number;
	deliveries: number;
	avgs: {
		closeTime: number;
	};
	shipVias: {
		[key: string]: number;
	};
}

type SVByType = Record<ShipViaType, string[]>;

// Generate new statistics from initial task data
export const genNewStats = (
	branch: string,
	tasks: PickTask[],
	mergeResult: TaskMergeResult
): Omit<StatSchema, '_id' | 'createdAt' | 'updatedAt'> & {
	start: Date;
	end: Date;
	branchId: string;
	shipVias: ShipViaStat[];
	closeIds: string[];
	closeTimes: number[];
} => {
	const today = new Date();
	const result = {
		start: startOfDay(today),
		end: endOfDay(today),
		branchId: branch,
		status: 'Current' as const,
		startTotal: tasks.length,
		endTotal: tasks.length,
		totals: [0],
		salesOrders: [0],
		transfers: [0],
		purchases: [0],
		closed: mergeResult.closeIds.length,
		closeIds: mergeResult.closeIds,
		closeTimes: mergeResult.closeTimes,
		updated: mergeResult.update.length,
		added: mergeResult.add.length,
		shipVias: [] as ShipViaStat[],
	};

	const shipVias: ShipViaStat[] = [];
	let total = 0;
	let salesOrders = 0;
	let transfers = 0;
	let purchases = 0;

	for (const task of tasks) {
		total++;
		switch (task.orderId[0]) {
			case 'S':
				salesOrders++;
				break;
			case 'T':
				transfers++;
				break;
			case 'P':
				purchases++;
				break;
		}
	}

	for (const task of mergeResult.add) {
		const svi = shipVias.findIndex((s) => s.name === task.shipVia);
		if (svi < 0) {
			shipVias.push({ name: task.shipVia, count: 1, priority: task.pickPriority });
		} else {
			shipVias[svi].count++;
		}
	}

	result.totals[0] = total;
	result.salesOrders[0] = salesOrders;
	result.transfers[0] = transfers;
	result.purchases[0] = purchases;
	result.shipVias = shipVias;

	return result;
};

// Update existing statistics
export const genStatUpdate = (
	existing: Stat,
	tasks: PickTask[],
	mergeResult: TaskMergeResult
): Partial<StatSchema> & {
	closeIds: string[];
	closeTimes: number[];
	shipVias: ShipViaStat[];
} => {
	const result = {
		purchases: [...existing.purchases],
		salesOrders: [...existing.salesOrders],
		shipVias: [...existing.shipVias],
		totals: [...existing.totals],
		transfers: [...existing.transfers],
		added: existing.added + mergeResult.add.length,
		closed: existing.closed + mergeResult.closeIds.length,
		closeIds: [...existing.closeIds, ...mergeResult.closeIds],
		closeTimes: [...existing.closeTimes, ...mergeResult.closeTimes],
		updated: existing.updated + mergeResult.update.length,
		endTotal: tasks.length,
	};

	let total = 0;
	let salesOrders = 0;
	let transfers = 0;
	let purchases = 0;

	for (const task of tasks) {
		total++;
		switch (task.orderId[0]) {
			case 'S':
				salesOrders++;
				break;
			case 'T':
				transfers++;
				break;
			case 'P':
				purchases++;
				break;
		}
	}

	for (const task of mergeResult.add) {
		const svi = result.shipVias.findIndex((s) => s.name === task.shipVia);
		if (svi < 0) {
			result.shipVias.push({ name: task.shipVia, count: 1, priority: task.pickPriority });
		} else {
			result.shipVias[svi].count++;
		}
	}

	result.totals.push(total);
	result.salesOrders.push(salesOrders);
	result.transfers.push(transfers);
	result.purchases.push(purchases);

	return result;
};

// Helper function to generate empty parsed stats
const generateEmpty = (branch: string): ParsedStats => {
	return {
		branch: branch,
		period: {
			start: new Date(),
			end: new Date(),
		},
		overall: {
			min: 99999999, // Impossible placeholder, so that all entries are less than it
			max: 0,
			total: 0,
			closed: 0,
			added: 0,
			dailyNet: 0,
		},
		salesOrders: {
			min: 99999999,
			max: 0,
			total: 0,
		},
		transfers: {
			min: 99999999,
			max: 0,
			total: 0,
		},
		purchases: {
			min: 99999999,
			max: 0,
			total: 0,
		},
		shipOuts: 0,
		deliveries: 0,
		avgs: {
			closeTime: 0,
		},
		shipVias: {},
	};
};

// Group ship vias by type
const shipViaByType = (shipVias: ShipVia[]): SVByType => {
	const result: SVByType = {
		Delivery: [],
		ShipOut: [],
		WillCall: [],
	};

	for (const sv of shipVias) {
		result[sv.type].push(sv.name);
	}

	return result;
};

// Parse raw statistics into formatted structure
export const parseStats = (stats: Stat, shipVias: ShipVia[]): ParsedStats => {
	const parsed: ParsedStats = generateEmpty(stats.branchId);

	parsed.period.start = stats.start;
	parsed.period.end = stats.end;

	const totalOrders = getMinMaxCount(stats.totals);
	const salesOrders = getMinMaxCount(stats.salesOrders);
	const transfers = getMinMaxCount(stats.transfers);
	const purchases = getMinMaxCount(stats.purchases);

	const dailyNet = stats.endTotal - stats.startTotal;

	parsed.overall = { ...totalOrders, closed: stats.closed, added: stats.added, dailyNet };
	parsed.salesOrders = salesOrders;
	parsed.transfers = transfers;
	parsed.purchases = purchases;
	parsed.avgs.closeTime = getAvg(stats.closeTimes, 1);

	const svsByType = shipViaByType(shipVias);

	for (const sv of stats.shipVias) {
		parsed.shipVias[sv.name] = sv.count;

		if (svsByType.Delivery.includes(sv.name)) {
			parsed.deliveries += sv.count;
		}
		if (svsByType.ShipOut.includes(sv.name)) {
			parsed.shipOuts += sv.count;
		}
	}

	return parsed;
};

// Calculate min, max, and total from number array
export const getMinMaxCount = (orders: number[]): { min: number; max: number; total: number } => {
	let total = 0;
	let min = 9_999_999;
	let max = 0;

	let prev = orders[0];
	for (const order of orders) {
		if (order < min) {
			min = order;
		}
		if (order > max) {
			max = order;
		}
		if (order > prev) {
			total += order - prev;
		}
		prev = order;
	}

	return { min, max, total };
};

// Calculate average with optional precision
export const getAvg = (numbers: number[], precision?: number): number => {
	let sum = 0;

	for (const num of numbers) {
		sum += num;
	}

	const avg = sum / numbers.length;

	if (precision) {
		return round(avg, precision);
	}

	return avg;
};

// Combine multiple stats into one
export const combineStats = (stats: Stat[]): Omit<Stat, '_id' | 'createdAt' | 'updatedAt'> => {
	const today = new Date();
	const result = {
		start: addYears(today, 50),
		end: subYears(today, 50),
		branchId: '',
		status: 'Current' as const,
		shipVias: [] as ShipViaStat[],
		startTotal: stats[0].startTotal,
		endTotal: stats[stats.length - 1].endTotal,
		totals: [] as number[],
		salesOrders: [] as number[],
		transfers: [] as number[],
		purchases: [] as number[],
		closed: 0,
		closeTimes: [] as number[],
		closeIds: [] as string[],
		updated: 0,
		added: 0,
	};

	for (const stat of stats) {
		if (stat.start.getTime() < result.start.getTime()) {
			result.start = stat.start;
		}
		if (stat.end.getTime() > result.end.getTime()) {
			result.end = stat.end;
		}

		for (const sv of stat.shipVias) {
			const svi = result.shipVias.findIndex((s) => s.name === sv.name);

			if (svi < 0) {
				result.shipVias.push({ name: sv.name, count: sv.count, priority: sv.priority });
			} else {
				result.shipVias[svi].count += sv.count;
			}
		}

		result.totals = [...result.totals, ...stat.totals];
		result.salesOrders = [...result.salesOrders, ...stat.salesOrders];
		result.transfers = [...result.transfers, ...stat.transfers];
		result.purchases = [...result.purchases, ...stat.purchases];
		result.closed += stat.closed;
		result.closeTimes = [...result.closeTimes, ...stat.closeTimes];
		result.closeIds = [...result.closeIds, ...stat.closeIds];
		result.updated += stat.updated;
		result.added += stat.added;
	}

	return result;
};

// Format date range for display
export const printDateRange = (start: Date, end: Date): string => {
	const sameYr = start.getFullYear() === end.getFullYear();
	const sameMonth = start.getMonth() === end.getMonth();
	const sameDay = start.getDay() === end.getDay();

	if (sameYr && sameMonth && sameDay) {
		return format(start, 'M/d/yyyy');
	}

	return `${format(start, 'M/d/yyyy')} - ${format(end, 'M/d/yyyy')}`;
};
