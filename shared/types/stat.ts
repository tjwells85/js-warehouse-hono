import * as z from 'zod';
import type { BaseDocument } from './_base';

/**
 * Stat status enumeration
 */
export const StatStatus = z.enum(['Current', 'Closed', 'Purge']);
export type StatStatus = z.infer<typeof StatStatus>;

/**
 * ShipVia statistics embedded type
 */
export interface ShipViaStat {
	name: string;
	count: number;
	priority: string;
}

/**
 * Stat interface - represents warehouse statistics and metrics
 */
export interface Stat extends BaseDocument {
	status: StatStatus;
	start: Date;
	end: Date;
	branchId: string; // Reference to Branch.brId
	shipVias: ShipViaStat[];
	startTotal: number;
	endTotal: number;
	totals: number[];
	salesOrders: number[];
	transfers: number[];
	purchases: number[];
	closed: number;
	closeTimes: number[];
	closeIds: string[]; // Array of ObjectIds as strings
	updated: number;
	added: number;
}
