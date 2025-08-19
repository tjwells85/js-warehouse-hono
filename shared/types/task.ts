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
 * Task filter type enumeration
 */
export const TaskFilterType = z.enum(['standard', 'willcall', 'transfers', 'shipouts', 'nonWillCall', 'deliveries']);
export type TaskFilterType = z.infer<typeof TaskFilterType>;

/**
 * Task query schema for route validation
 */
export const TaskQuerySchema = z.object({
	type: TaskFilterType.optional(),
});
export type TaskQuerySchema = z.infer<typeof TaskQuerySchema>;

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

/**
 * Zod schema for Task validation
 * Used for both inserts and updates (.partial() for updates)
 */
export const TaskSchema = z.object({
	orderId: z.string().nonempty('Order ID is required'),
	generationId: z.number().int(),
	invoiceId: z.string().nonempty('Invoice ID is required'),
	branchId: z.string().nonempty('Branch ID is required'),
	pickGroup: z.string().nonempty('Pick group is required'),
	assignedUserId: z.string().nonempty('Assigned user ID is required'),
	billTo: z.number().int(),
	shipTo: z.number().int(),
	shipToName: z.string().nonempty('Ship to name is required'),
	pickCount: z.string().nonempty('Pick count is required'),
	shipVia: z.string().nonempty('Ship via is required'),
	isFromMultipleZones: z.boolean(),
	taskState: TaskState,
	taskWeight: z.number().int(),
	pickAndPassBlink: z.boolean(),
	pickPriority: z.string().nonempty('Pick priority is required'),
	transferShippingBranch: z.string().optional(),
	transferReceivingBranch: z.string().optional(),
	totes: z.array(z.string()).default([]),
	lastSeen: z.date().default(() => new Date()),
	activeTime: z.number().int().default(0),
	orderType: OrderType,
});

export type TaskSchema = z.infer<typeof TaskSchema>;
