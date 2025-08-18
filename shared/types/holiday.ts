import * as z from 'zod';
import type { BaseDocument } from './_base';

/**
 * Holiday interface - represents company holidays
 */
export interface Holiday extends BaseDocument {
	name: string;
	start: Date;
	end: Date;
}

/**
 * Zod schema for Holiday validation
 * Used for both inserts and updates (.partial() for updates)
 */
export const HolidaySchema = z.object({
	name: z.string().nonempty('Holiday name is required').trim(),
	start: z.date(),
	end: z.date(),
});

export type HolidaySchema = z.infer<typeof HolidaySchema>;
