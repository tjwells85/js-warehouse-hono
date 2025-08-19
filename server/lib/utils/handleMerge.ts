import type { Task, TaskSchema } from '@shared/types';
import { ShipViaModel } from '@server/db/models';
import { parsePickTask } from '@shared/utils';
import { isActiveTime } from '@server/lib/utils';
import { getLocalDate, getAdjustedTime } from '@shared/utils';
import ms from 'ms';

// Eclipse API PickTask interface
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

export interface TaskMergeResult {
	closeIds: string[];
	closeTimes: number[];
	update: Array<{ id: string; body: Partial<TaskSchema> }>;
	add: Array<Omit<TaskSchema, '_id' | 'createdAt' | 'updatedAt'> & { lastSeen: Date; activeTime: number }>;
}

export const handleMerge = async (current: Task[], newData: PickTask[], shipVias: Set<string>): Promise<TaskMergeResult> => {
	const result: TaskMergeResult = {
		closeIds: [],
		closeTimes: [],
		update: [],
		add: [],
	};

	const toAdd: PickTask[] = [...newData];
	const activeTime = await isActiveTime();
	const now = Date.now();

	for (let i = 0; i < current.length; i++) {
		const invoice = `${current[i].orderId}.${current[i].invoiceId}`; // Order.Generation
		const upIndex = toAdd.findIndex((c) => `${c.orderId}.${c.invoiceId}` === invoice);

		if (upIndex < 0) {
			const notRecent = Date.now() - current[i].lastSeen.getTime() > ms('3m');
			if (newData.length > 0 || current.length < 3 || notRecent) {
				result.closeIds.push(current[i]._id); // If not found, add id to close list.
				const closeTime = getAdjustedTime(current[i]);
				result.closeTimes.push(closeTime);
			}
		} else {
			const upd = parsePickTask(toAdd[upIndex]);
			let aTime = current[i].activeTime;

			if (activeTime) {
				const currLastSeen = getLocalDate(current[i].lastSeen).getTime();
				const diff = Math.round((now - currLastSeen) / 1000);
				aTime += diff;
				upd.activeTime = aTime;
			}

			result.update.push({ id: current[i]._id, body: upd });
			toAdd.splice(upIndex, 1);
		}
	}

	for (const newTask of toAdd) {
		if (!shipVias.has(newTask.shipVia)) {
			// Try to find existing ShipVia first
			const existingShipVia = await ShipViaModel.findOne({ name: newTask.shipVia }).lean();

			if (!existingShipVia) {
				// Only create if it doesn't exist
				await ShipViaModel.create({
					name: newTask.shipVia,
					priority: parseInt(newTask.pickPriority),
					type: 'WillCall', // Default type
				});
			}

			// Add to our Set so we don't check again in this batch
			shipVias.add(newTask.shipVia);
		}

		const dto = parsePickTask(newTask);
		if (activeTime) {
			dto.activeTime = 1;
		}
		result.add.push(dto);
	}

	return result;
};
