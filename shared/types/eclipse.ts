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
