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
 * Zod schema for ShipViaStat validation
 */
export const ShipViaStatSchema = z.object({
	name: z.string().nonempty('Ship via name is required'),
	count: z.number().int().min(0, 'Count must be non-negative'),
	priority: z.string().nonempty('Priority is required'),
});

export type ShipViaStatSchema = z.infer<typeof ShipViaStatSchema>;

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

/**
 * Zod schema for Stat validation
 * Used for both inserts and updates (.partial() for updates)
 */
export const StatSchema = z.object({
	status: StatStatus.default('Current'),
	start: z.date(),
	end: z.date(),
	branchId: z.string().nonempty('Branch ID is required'),
	shipVias: z.array(ShipViaStatSchema).default([]),
	startTotal: z.number().int().default(0),
	endTotal: z.number().int().default(0),
	totals: z.array(z.number().int()).default([]),
	salesOrders: z.array(z.number().int()).default([]),
	transfers: z.array(z.number().int()).default([]),
	purchases: z.array(z.number().int()).default([]),
	closed: z.number().int().default(0),
	closeTimes: z.array(z.number()).default([]),
	closeIds: z.array(z.string()).default([]),
	updated: z.number().int().default(0),
	added: z.number().int().default(0),
});

export type StatSchema = z.infer<typeof StatSchema>;
