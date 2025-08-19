import axios from 'axios';
import { ProcessEnv } from '@server/env';
import { EclipseSessionModel, LogModel } from '@server/db/models';
import type { EclipseSession } from '@shared/types';
import { getFnTime } from '@shared/utils';
import { HTTPException } from 'hono/http-exception';

// Types for Eclipse API
interface SessionRequest {
	username: string;
	password: string;
	loginType?: 'Employee' | 'Developer' | 'Partner' | 'Customer' | 'Vendor' | 'Contact' | 'Anonymous';
	workstationId?: string;
	printerLocationId?: string;
	applicationKey?: string;
	developerKey?: string;
	deviceId?: string;
	clientDescription?: string;
}

interface SessionResponse {
	id: string;
	sessionUser: {
		id: string;
		userName: string;
		type: string;
		roles: { id: string }[];
		companies: { id: string }[];
	};
	sessionToken: string;
	refreshToken: string;
	applicationKey: string;
	developerKey: string;
	clientDescription: string;
	deviceId: string;
	workstationId: string;
	printerLocationId: string;
	validPrinterLocationIds: string[];
	creationDateTime: string;
	lastUsedDateTime: string;
}

// Create axios instance for Eclipse API
const eclipse = axios.create({
	baseURL: ProcessEnv.ECLIPSE_URL,
});

/**
 * Login to Eclipse API and create new session
 */
export const login = async (): Promise<EclipseSession> => {
	const body: SessionRequest = {
		username: ProcessEnv.ECLIPSE_USER,
		password: ProcessEnv.ECLIPSE_PASS,
		loginType: 'Employee',
	};

	const before = Date.now();

	try {
		const { data, status } = await eclipse.post<SessionResponse>('/Sessions', body);
		const after = Date.now();

		// Log successful login
		await LogModel.create({
			message: 'Logged into Eclipse API',
			type: 'Success',
			httpStatus: status.toString(),
			file: 'server/services/eclipse/session.ts',
			fn: 'login',
			time: getFnTime(before, after),
		});

		// Clear existing sessions
		await EclipseSessionModel.deleteMany({});

		// Create new session (excluding id and sessionUser from response)
		const { id, sessionUser, ...sessionData } = data;

		const session = await EclipseSessionModel.create({
			sessionId: id,
			...sessionData,
			creationDateTime: new Date(sessionData.creationDateTime),
			lastUsedDateTime: new Date(sessionData.lastUsedDateTime),
		});

		return session.toObject();
	} catch (error: any) {
		const after = Date.now();

		// Log failed login
		await LogModel.create({
			message: `Failed to login to Eclipse API: ${error.message}`,
			type: 'Error',
			httpStatus: error.response?.status?.toString() || '0',
			file: 'server/services/eclipse/session.ts',
			fn: 'login',
			time: getFnTime(before, after),
		});

		throw new HTTPException(500, { message: 'Failed to authenticate with Eclipse API' });
	}
};

/**
 * Get current valid session or create new one
 */
export const getSession = async (): Promise<EclipseSession> => {
	const session = await EclipseSessionModel.findOne({ isValid: { $ne: false } }).lean();

	if (!session) {
		return await login();
	}

	return session;
};

/**
 * Get current Eclipse session (for external use)
 */
export const getCurrentSession = async (): Promise<EclipseSession> => {
	return await getSession();
};

/**
 * Force refresh Eclipse session
 */
export const refreshSession = async (): Promise<EclipseSession> => {
	return await login();
};

/**
 * Invalidate current session
 */
export const invalidateSession = async (): Promise<void> => {
	await EclipseSessionModel.updateMany({}, { isValid: false });
};

/**
 * Wrapper function to handle Eclipse API calls with automatic session management
 */
export const withEclipse = async <T = unknown, Q = unknown>(fn: (token: string, args?: Q) => Promise<T>, args?: Q): Promise<T> => {
	try {
		const session = await getSession();
		return await fn(session.sessionToken, args);
	} catch (error: any) {
		// If API call fails, try with fresh session
		const session = await login();
		return await fn(session.sessionToken, args);
	}
};
