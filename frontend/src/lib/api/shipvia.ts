// @frontend/lib/api/shipvia.ts
import type { ShipVia, ShipViaSchema } from '@shared/types';
import type { ApiResponse } from '@frontend/lib/types';
import { apiClient } from '@frontend/lib/api/client';
import { deserialize } from '@frontend/lib/utils';

export const getAllShipVias = async (): Promise<ApiResponse<ShipVia[]>> => {
	const response = await apiClient.shipvias.$get();

	if (response.ok) {
		const data = await deserialize<ShipVia[]>(response);
		return { status: response.status, data };
	}

	const error = await response.json();
	return { status: response.status, error };
};

export const getShipViaById = async (id: string): Promise<ApiResponse<ShipVia>> => {
	const response = await apiClient.shipvias[':id'].$get({ param: { id } });

	if (response.ok) {
		const data = await deserialize<ShipVia>(response);
		return { status: response.status, data };
	}

	const error = await response.json();
	return { status: response.status, error };
};

export const updateShipVia = async (id: string, data: ShipViaSchema): Promise<ApiResponse<ShipVia>> => {
	const response = await apiClient.shipvias[':id'].$put({ param: { id }, json: data });

	if (response.ok) {
		const data = await deserialize<ShipVia>(response);
		return { status: response.status, data };
	}

	const error = await response.json();
	return { status: response.status, error };
};

export const deleteShipVia = async (id: string): Promise<ApiResponse<ShipVia>> => {
	const response = await apiClient.shipvias[':id'].$delete({ param: { id } });

	if (response.ok) {
		const data = await deserialize<ShipVia>(response);
		return { status: response.status, data };
	}

	const error = await response.json();
	return { status: response.status, error };
};
