import * as z from 'zod';
import type { BaseDocument } from './_base';

/**
 * EclipseSession interface - represents active Eclipse API session data
 */
export interface EclipseSession extends BaseDocument {
	sessionId: string;
	sessionToken: string;
	refreshToken: string;
	applicationKey: string;
	developerKey: string;
	clientDescription: string;
	deviceId: string;
	workstationId: string;
	printerLocationId: string;
	validPrinterLocationIds: string[];
	alternateSessionId: string;
	creationDateTime: Date;
	lastUsedDateTime: Date;
	expiresIn?: number;
	tokenType?: string;
	isValid: boolean;
}

/**
 * Zod schema for EclipseSession validation
 * Used for both inserts and updates (.partial() for updates)
 */
export const EclipseSessionSchema = z.object({
	sessionId: z.string().nonempty('Session ID is required'),
	sessionToken: z.string().nonempty('Session token is required'),
	refreshToken: z.string().nonempty('Refresh token is required'),
	applicationKey: z.string().default(''),
	developerKey: z.string().default(''),
	clientDescription: z.string().default(''),
	deviceId: z.string().default(''),
	workstationId: z.string().default(''),
	printerLocationId: z.string().default(''),
	validPrinterLocationIds: z.array(z.string()).default([]),
	alternateSessionId: z.string().default(''),
	creationDateTime: z.date(),
	lastUsedDateTime: z.date(),
	expiresIn: z.number().int().positive().optional(),
	tokenType: z.string().optional(),
	isValid: z.boolean().default(true),
});

export type EclipseSessionSchema = z.infer<typeof EclipseSessionSchema>;
