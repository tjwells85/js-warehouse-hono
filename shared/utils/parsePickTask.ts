import type { TaskState, TaskSchema } from '@shared/types';
import { getOrdType } from './getOrderType';

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

export const parsePickTask = (pickTask: PickTask): Omit<TaskSchema, '_id' | 'createdAt' | 'updatedAt'> & { lastSeen: Date; activeTime: number } => {
	const xferShipBr = pickTask.transferShippingBranch === '' ? undefined : pickTask.transferShippingBranch;
	const xferRcvBr = pickTask.transferReceivingBranch === '' ? undefined : pickTask.transferReceivingBranch;

	return {
		orderId: pickTask.orderId,
		generationId: pickTask.generationId,
		invoiceId: pickTask.invoiceId,
		branchId: pickTask.branchId,
		pickGroup: pickTask.pickGroup || 'DEFAULT', // Handle empty pickGroup
		assignedUserId: pickTask.assignedUserId || 'UNASSIGNED', // Handle empty assignedUserId
		billTo: pickTask.billTo,
		shipTo: pickTask.shipTo,
		shipToName: pickTask.shipToName,
		pickCount: pickTask.pickCount,
		shipVia: pickTask.shipVia,
		isFromMultipleZones: pickTask.isFromMultipleZones,
		taskState: pickTask.taskState as TaskState,
		taskWeight: pickTask.taskWeight,
		pickAndPassBlink: pickTask.pickAndPassBlink,
		pickPriority: pickTask.pickPriority,
		transferShippingBranch: xferShipBr,
		transferReceivingBranch: xferRcvBr,
		totes: pickTask.totes,
		lastSeen: new Date(),
		orderType: getOrdType(pickTask),
		activeTime: 0,
	};
};
