import * as z from 'zod';
import type { BaseDocument } from './_base';

/**
 * Branch interface - represents warehouse branch locations
 */
export interface Branch extends BaseDocument {
	brId: string; // Unique branch identifier
	num: number; // Branch number
	name: string; // Branch display name
}

/**
 * Zod schema for Branch validation
 * Used for both inserts and updates (.partial() for updates)
 */
export const BranchSchema = z.object({
	brId: z.string().nonempty('Branch ID is required').trim(),
	num: z.number().int().positive('Branch number must be positive'),
	name: z.string().nonempty('Branch name is required').trim(),
});

export type BranchSchema = z.infer<typeof BranchSchema>;
