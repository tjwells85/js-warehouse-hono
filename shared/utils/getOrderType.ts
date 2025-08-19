import { OrderType } from '@shared/types';
import type { Task } from '@shared/types';

// Type for PickTask from Eclipse API
interface PickTask {
	orderId: string;
	[key: string]: any;
}

export const getOrdType = (task: Task | PickTask): OrderType => {
	const first = task.orderId[0];
	switch (first) {
		case 'S':
			return 'SaleOrder';
		case 'T':
			return 'TransferOrder';
		case 'P':
			return 'PurchaseOrder';
		case 'W':
			return 'WorkOrder';
		default:
			return 'SaleOrder';
	}
};
