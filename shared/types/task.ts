import * as z from 'zod';
import type { BaseDocument } from './_base';

/**
 * Task state enumeration
 */
export const TaskState = z.enum(['Open', 'Assigned', 'Closed']);
export type TaskState = z.infer<typeof TaskState>;

/**
 * Order type enumeration
 */
export const OrderType = z.enum(['TransferOrder', 'PurchaseOrder', 'SaleOrder', 'WorkOrder']);
export type OrderType = z.infer<typeof OrderType>;

/**
 * Task interface - represents warehouse picking tasks
 */
export interface Task extends BaseDocument {
	orderId: string;
	generationId: number;
	invoiceId: string;
	branchId: string; // Reference to Branch.brId
	pickGroup: string;
	assignedUserId: string;
	billTo: number;
	shipTo: number;
	shipToName: string;
	pickCount: string;
	shipVia: string; // Reference to ShipVia.name
	isFromMultipleZones: boolean;
	taskState: TaskState;
	taskWeight: number;
	pickAndPassBlink: boolean;
	pickPriority: string;
	transferShippingBranch?: string; // Optional reference to Branch.brId
	transferReceivingBranch?: string; // Optional reference to Branch.brId
	totes: string[];
	lastSeen: Date;
	activeTime: number;
	orderType: OrderType;
}
