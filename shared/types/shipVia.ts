import { z } from 'zod';
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

/**
 * Zod schema for ShipVia validation
 * Used for both inserts and updates (.partial() for updates)
 */
export const ShipViaSchema = z.object({
	name: z.string().nonempty('Ship via name is required').trim(),
	priority: z.number().int().min(0, 'Priority must be non-negative'),
	type: ShipViaType.default('WillCall'),
});

export type ShipViaSchema = z.infer<typeof ShipViaSchema>;
