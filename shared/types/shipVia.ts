import * as z from 'zod';
import type { BaseDocument } from './_base';

/**
 * ShipVia type enumeration
 */
export const ShipViaType = z.enum(['WillCall', 'Delivery', 'ShipOut']);
export type ShipViaType = z.infer<typeof ShipViaType>;

/**
 * ShipVia interface - represents shipping methods
 */
export interface ShipVia extends BaseDocument {
	name: string;
	priority: number;
	type: ShipViaType;
}
