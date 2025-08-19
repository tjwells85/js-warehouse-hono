import axios from 'axios';
import { ProcessEnv } from '@server/env';
import { TaskModel, ShipViaModel, StatModel, LogModel } from '@server/db/models';
import { handleMerge } from '@server/lib/utils/handleMerge';
import { genNewStats, genStatUpdate } from '@server/lib/utils/stats';
import { getAllBranches } from '@server/services/branch';
import { sleep, getFnTime } from '@shared/utils';
import type { TaskMergeResult } from '@server/lib/utils/handleMerge';

// Eclipse API interfaces
interface PickTaskQuery {
	branchId: string;
	userId?: string;
	pickGroup?: string;
	shipVia?: string;
	productId?: string;
	orderId?: string;
	orderType?: 'TransferOrder' | 'PurchaseOrder' | 'SaleOrder' | 'WorkOrder' | 'ALL';
	state?: 'Open' | 'Assigned' | 'Closed' | 'ALL';
}

interface PickTaskMetadata {
	startIndex: number;
	pageSize: number;
	totalItems: number;
}

interface PickTask {
	orderId: string;
	generationId: number;
	invoiceId: string;
	branchId: string;
	pickGroup: string;
	assignedUserId: string;
	billTo: number;
	shipTo: number;
	shipToName: string;
	pickCount: string;
	shipVia: string;
	isFromMultipleZones: boolean;
	taskState: string;
	taskWeight: number;
	pickAndPassBlink: boolean;
	pickPriority: string;
	transferShippingBranch: string;
	transferReceivingBranch: string;
	totes: string[];
}

interface PickTaskResponse {
	metadata: PickTaskMetadata;
	results: PickTask[];
}

// Create axios instance for Eclipse API
const eclipse = axios.create({
	baseURL: ProcessEnv.ECLIPSE_URL,
});

/**
 * Get picking tasks for one branch from Eclipse API
 */
export const getOneBranchPicks = async (token: string, args: PickTaskQuery): Promise<TaskMergeResult> => {
	const [existing, shipViaNames] = await Promise.all([TaskModel.find({ branchId: args.branchId, taskState: { $ne: 'Closed' } }).lean(), ShipViaModel.find({}, { name: 1 }).lean()]);

	const before = Date.now();

	try {
		const { data, status } = await eclipse.get<PickTaskResponse>('/WarehouseTasks/PickTasks', {
			params: { branchId: args.branchId, userId: 'ALL', pageSize: 200 },
			headers: { sessionToken: token },
		});

		const after = Date.now();

		const shipVias = new Set<string>();
		for (const { name } of shipViaNames) {
			shipVias.add(name);
		}

		const merged = await handleMerge(existing, data.results, shipVias);

		// Handle statistics
		const today = new Date();
		const stat = await StatModel.findOne({
			branchId: args.branchId,
			start: { $lt: today },
			end: { $gt: today },
		}).lean();

		if (stat) {
			const edit = genStatUpdate(stat, data.results, merged);
			await StatModel.findByIdAndUpdate(stat._id, edit);
		} else {
			const stats = genNewStats(args.branchId, data.results, merged);
			const newStat = await StatModel.create(stats);

			// Close other stats for this branch
			await StatModel.updateMany(
				{
					_id: { $ne: newStat._id },
					branchId: args.branchId,
					status: { $ne: 'Purge' },
				},
				{ status: 'Closed' }
			);
		}

		// Log the operation
		await LogModel.create({
			message: `Fetching data for branch ${args.branchId}, Count: ${data.metadata.totalItems}`,
			type: status === 200 ? 'Success' : 'Error',
			httpStatus: status.toString(),
			file: 'server/services/eclipse/task.ts',
			fn: 'getOneBranchPicks',
			time: getFnTime(before, after),
		});

		return merged;
	} catch (error: any) {
		const after = Date.now();

		await LogModel.create({
			message: `Failed to fetch data for branch ${args.branchId}: ${error.message}`,
			type: 'Error',
			httpStatus: error.response?.status?.toString() || '0',
			file: 'server/services/eclipse/task.ts',
			fn: 'getOneBranchPicks',
			time: getFnTime(before, after),
		});

		throw error;
	}
};

/**
 * Get picking tasks for all branches from Eclipse API
 */
export const getAllBranchPicks = async (token: string): Promise<void> => {
	const branches = await getAllBranches();

	const results: TaskMergeResult = {
		closeIds: [],
		closeTimes: [],
		update: [],
		add: [],
	};

	const before = Date.now();

	for (let i = 0; i < branches.length; i++) {
		const br = branches[i];
		const picks = await getOneBranchPicks(token, { branchId: br.brId });

		results.closeIds = [...results.closeIds, ...picks.closeIds];
		results.update = [...results.update, ...picks.update];
		results.add = [...results.add, ...picks.add];

		if (i !== branches.length - 1) {
			// No need to sleep on the last one
			await sleep(5000); // Slow down API calls
		}
	}

	const after = Date.now() - (branches.length - 1) * 5000; // Adjust for sleep time

	let closed = 0;
	let updated = 0;
	let added = 0;

	// Process the results
	if (results.closeIds.length > 0) {
		const closeResult = await TaskModel.updateMany({ _id: { $in: results.closeIds }, taskState: { $ne: 'Closed' } }, { taskState: 'Closed' });
		closed = closeResult.modifiedCount || 0;
	}

	if (results.add.length > 0) {
		const addResult = await TaskModel.insertMany(results.add);
		added = addResult.length;
	}

	if (results.update.length > 0) {
		for (const up of results.update) {
			await TaskModel.findByIdAndUpdate(up.id, up.body);
			updated++;
		}
	}

	await LogModel.create({
		type: 'Success',
		message: `Updated Tasks: ${added} Added, ${updated} Updated, ${closed} Closed.`,
		time: getFnTime(before, after),
		file: 'server/services/eclipse/task.ts',
		fn: 'getAllBranchPicks',
	});
};
