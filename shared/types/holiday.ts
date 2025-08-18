import type { BaseDocument } from './_base';

/**
 * Holiday interface - represents company holidays
 */
export interface Holiday extends BaseDocument {
	name: string;
	start: Date;
	end: Date;
}
