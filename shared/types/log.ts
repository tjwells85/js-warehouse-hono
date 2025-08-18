import * as z from 'zod';
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
