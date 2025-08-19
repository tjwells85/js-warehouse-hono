// @frontend/lib/api/task.ts
import type { Task, TaskFilterType } from '@shared/types';
import type { ApiResponse } from '@frontend/lib/types';
import { apiClient } from '@frontend/lib/api/client';
import { deserialize } from '@frontend/lib/utils';

export const getTasksForBranch = async (branchId: string, type?: TaskFilterType): Promise<ApiResponse<Task[]>> => {
	const query = type ? { type } : {};
	const response = await apiClient.tasks[':branch'].$get({
		param: { branch: branchId },
		query,
	});

	if (response.ok) {
		const data = await deserialize<Task[]>(response);
		return { status: response.status, data };
	}

	const error = await response.json();
	return { status: response.status, error };
};
