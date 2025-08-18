import { Schema, model } from 'mongoose';
import type { Task } from '@shared/types';
import { TaskState, OrderType } from '@shared/types';

const TaskMongoSchema = new Schema<Task>(
	{
		orderId: {
			type: String,
			required: true,
		},
		generationId: {
			type: Number,
			required: true,
		},
		invoiceId: {
			type: String,
			required: true,
		},
		branchId: {
			type: String,
			required: true,
			ref: 'Branch',
		},
		pickGroup: {
			type: String,
			required: true,
		},
		assignedUserId: {
			type: String,
			required: true,
		},
		billTo: {
			type: Number,
			required: true,
		},
		shipTo: {
			type: Number,
			required: true,
		},
		shipToName: {
			type: String,
			required: true,
		},
		pickCount: {
			type: String,
			required: true,
		},
		shipVia: {
			type: String,
			required: true,
			ref: 'ShipVia',
		},
		isFromMultipleZones: {
			type: Boolean,
			required: true,
		},
		taskState: {
			type: String,
			enum: TaskState.options,
			required: true,
		},
		taskWeight: {
			type: Number,
			required: true,
		},
		pickAndPassBlink: {
			type: Boolean,
			required: true,
		},
		pickPriority: {
			type: String,
			required: true,
		},
		transferShippingBranch: {
			type: String,
			required: false,
			ref: 'Branch',
		},
		transferReceivingBranch: {
			type: String,
			required: false,
			ref: 'Branch',
		},
		totes: {
			type: [String],
			default: [],
		},
		lastSeen: {
			type: Date,
			default: Date.now,
		},
		activeTime: {
			type: Number,
			default: 0,
		},
		orderType: {
			type: String,
			enum: OrderType.options,
			required: true,
		},
	},
	{
		timestamps: true,
		collection: 'tasks',
	}
);

// Create indexes for performance (based on your Prisma schema)
TaskMongoSchema.index({ branchId: 1 });
TaskMongoSchema.index({ taskState: 1 });
TaskMongoSchema.index({ lastSeen: -1 });
TaskMongoSchema.index({ pickPriority: 1 });
TaskMongoSchema.index({ orderType: 1 });

// Export the model
export const TaskModel = model<Task>('Task', TaskMongoSchema);
export default TaskModel;
