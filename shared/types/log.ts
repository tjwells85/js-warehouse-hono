import { z } from 'zod';
import type { BaseDocument } from './_base';

/**
 * Log type enumeration
 */
export const LogType = z.enum(['Info', 'Warn', 'Error', 'Success']);
export type LogType = z.infer<typeof LogType>;

/**
 * Log interface - represents system log entries
 */
export interface Log extends BaseDocument {
	timestamp: Date;
	message: string;
	file: string;
	route: string;
	line: string;
	httpStatus: string;
	fn: string;
	type: LogType;
	time: number;
}

/**
 * Zod schema for Log validation
 * Used for both inserts and updates (.partial() for updates)
 */
export const LogSchema = z.object({
	timestamp: z.date().optional(),
	message: z.string().nonempty('Log message is required'),
	file: z.string().default(''),
	route: z.string().default(''),
	line: z.string().default(''),
	httpStatus: z.string().default(''),
	fn: z.string().default(''),
	type: LogType,
	time: z.number().default(-1.0),
});

export type LogSchema = z.infer<typeof LogSchema>;
