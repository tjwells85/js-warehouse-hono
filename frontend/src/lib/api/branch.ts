// @frontend/lib/api/branch.ts
import type { Branch, BranchSchema } from '@shared/types';
import type { ApiResponse } from '@frontend/lib/types';
import { apiClient } from '@frontend/lib/api/client';
import { deserialize } from '@frontend/lib/utils';

export const createBranch = async (data: BranchSchema): Promise<ApiResponse<Branch>> => {
	const response = await apiClient.branches.$post({ json: data });

	if (response.ok) {
		const data = await deserialize<Branch>(response);
		return { status: response.status, data };
	}

	const error = await response.json();
	return { status: response.status, error };
};

export const getAllBranches = async (): Promise<ApiResponse<Branch[]>> => {
	const response = await apiClient.branches.$get();

	if (response.ok) {
		const data = await deserialize<Branch[]>(response);
		return { status: response.status, data };
	}

	const error = await response.json();
	return { status: response.status, error };
};

export const getBranchById = async (id: string): Promise<ApiResponse<Branch>> => {
	const response = await apiClient.branches[':id'].$get({ param: { id } });

	if (response.ok) {
		const data = await deserialize<Branch>(response);
		return { status: response.status, data };
	}

	const error = await response.json();
	return { status: response.status, error };
};

export const updateBranch = async (id: string, data: BranchSchema): Promise<ApiResponse<Branch>> => {
	const response = await apiClient.branches[':id'].$put({ param: { id }, json: data });

	if (response.ok) {
		const data = await deserialize<Branch>(response);
		return { status: response.status, data };
	}

	const error = await response.json();
	return { status: response.status, error };
};

export const deleteBranch = async (id: string): Promise<ApiResponse<Branch>> => {
	const response = await apiClient.branches[':id'].$delete({ param: { id } });

	if (response.ok) {
		const data = await deserialize<Branch>(response);
		return { status: response.status, data };
	}

	const error = await response.json();
	return { status: response.status, error };
};
