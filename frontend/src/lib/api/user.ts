import type { User, UserSchema } from '@shared/types';
import type { ApiResponse } from '../types';
import { authClient } from '@frontend/lib/auth-client';

export const getUsers = async (): Promise<User[]> => {
	const { data, error } = await authClient.admin.listUsers({ query: {} });

	if (error || !data.users) {
		return [];
	}

	return data.users as User[];
};

export const createUser = async (data: UserSchema): Promise<ApiResponse<User>> => {
	const { data: user, error } = await authClient.admin.createUser({ ...data });

	if (!user || error) {
		return { status: 500, error: error };
	}

	return { status: 201, data: user.user as User };
};

export const registerPasskey = async (name?: string): Promise<ApiResponse<true>> => {
	try {
		const res = await authClient.passkey.addPasskey({ name });
		if (res?.error) {
			return { status: res.error.status, error: res.error.message ?? res.error.statusText };
		}

		return { status: 201, data: true };
	} catch (error) {
		const message = error instanceof Error ? error.message : 'An unknown error occurred';
		return { status: 500, error: message };
	}
};
