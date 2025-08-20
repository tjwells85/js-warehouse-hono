import { TaskModel, ShipViaModel } from '@server/db/models';
import type { Task } from '@shared/types';

export interface TaskFilters {
	branchId: string;
	taskState?: 'Open' | 'Assigned' | 'Closed';
	orderType?: 'TransferOrder' | 'PurchaseOrder' | 'SaleOrder' | 'WorkOrder';
	shipVia?: { $in: string[] };
	$or?: Array<{
		orderType?: string;
		shipVia?: { $in: string[] };
	}>;
}

/**
 * Flatten ShipVia objects to array of names
 */
const flattenShipVias = (shipVias: Array<{ name: string }>): string[] => {
	return shipVias.map((sv) => sv.name);
};

/**
 * Get tasks for a branch with optional filtering
 */
export const getTasksForBranch = async (branchId: string, type?: string): Promise<Task[]> => {
	// Verify branch exists
	let typeTitle = ' All Picks';
	const filters: TaskFilters = {
		branchId: branchId,
		taskState: 'Open',
	};

	if (type) {
		switch (type) {
			case 'standard': {
				const shipVias = flattenShipVias(
					await ShipViaModel.find(
						{
							type: { $in: ['WillCall', 'Delivery'] },
						},
						{ name: 1 }
					).lean()
				);
				filters.shipVia = { $in: shipVias };
				typeTitle = ' Will Call & Deliveries';
				break;
			}

			case 'willcall': {
				const shipVias = flattenShipVias(await ShipViaModel.find({ type: 'WillCall' }, { name: 1 }).lean());
				filters.shipVia = { $in: shipVias };
				typeTitle = ' Will Call';
				break;
			}

			case 'transfers': {
				filters.orderType = 'TransferOrder';
				typeTitle = ' Transfers';
				break;
			}

			case 'shipouts': {
				const shipVias = flattenShipVias(await ShipViaModel.find({ type: 'ShipOut' }, { name: 1 }).lean());
				filters.$or = [{ orderType: 'TransferOrder' }, { shipVia: { $in: shipVias } }];
				typeTitle = ' Ship-Outs';
				break;
			}

			case 'nonWillCall': {
				const shipVias = flattenShipVias(await ShipViaModel.find({ type: { $ne: 'WillCall' } }, { name: 1 }).lean());
				filters.$or = [{ orderType: 'TransferOrder' }, { shipVia: { $in: shipVias } }];
				typeTitle = ' Transfers/Deliveries/Ship-Outs';
				break;
			}

			case 'deliveries': {
				const shipVias = flattenShipVias(await ShipViaModel.find({ type: 'Delivery' }, { name: 1 }).lean());
				filters.orderType = 'SaleOrder';
				filters.shipVia = { $in: shipVias };
				typeTitle = ' Deliveries';
				break;
			}
		}
	}

	const tasks = await TaskModel.find(filters)
		.sort({
			pickPriority: 1, // asc
			createdAt: -1, // desc
			orderId: 1, // asc
			generationId: 1, // asc
		})
		.lean();

	return tasks;
};
