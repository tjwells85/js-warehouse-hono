import { apiClient } from './client';
import type { ApiResponse } from '../types';
import type { Holiday, HolidaySchema } from '@shared/types';
import { deserialize } from '../utils';

export const getHolidays = async (): Promise<ApiResponse<Holiday[]>> => {
	const res = await apiClient.holidays.$get();
	if (!res.ok) {
		return { status: res.status, error: (await res.json()) ?? res.statusText };
	}

	const holidays = await deserialize<Holiday[]>(res);
	return { status: 200, data: holidays };
};

export const getHoliday = async (id: string): Promise<ApiResponse<Holiday>> => {
	const res = await apiClient.holidays[':id'].$get({ param: { id } });
	if (!res.ok) {
		return { status: res.status, error: (await res.json()) ?? res.statusText };
	}

	const holiday = await deserialize<Holiday>(res);
	return { status: 200, data: holiday };
};

export const addHoliday = async (body: HolidaySchema): Promise<ApiResponse<Holiday>> => {
	const res = await apiClient.holidays.$post({ json: body });
	if (!res.ok) {
		return { status: res.status, error: (await res.json()) ?? res.statusText };
	}

	const holiday = await deserialize<Holiday>(res);
	return { status: 201, data: holiday };
};

export const updateHoliday = async (id: string, body: Partial<HolidaySchema>): Promise<ApiResponse<Holiday>> => {
	const res = await apiClient.holidays[':id'].$put({ param: { id }, json: body });
	if (!res.ok) {
		return { status: res.status, error: (await res.json()) ?? res.statusText };
	}

	const holiday = await deserialize<Holiday>(res);
	return { status: 200, data: holiday };
};

export const deleteHoliday = async (id: string): Promise<ApiResponse<Holiday>> => {
	const res = await apiClient.holidays[':id'].$delete({ param: { id } });
	if (!res.ok) {
		return { status: res.status, error: (await res.json()) ?? res.statusText };
	}

	const holiday = await deserialize<Holiday>(res);
	return { status: 200, data: holiday };
};
