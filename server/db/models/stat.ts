import { Schema, model } from 'mongoose';
import type { Stat, ShipViaStat } from '@shared/types';
import { StatStatus } from '@shared/types';

// Embedded schema for ShipViaStat
const ShipViaStatSchema = new Schema<ShipViaStat>(
	{
		name: {
			type: String,
			required: true,
		},
		count: {
			type: Number,
			required: true,
			min: 0,
		},
		priority: {
			type: String,
			required: true,
		},
	},
	{ _id: false }
); // Don't generate _id for embedded documents

const StatMongoSchema = new Schema<Stat>(
	{
		status: {
			type: String,
			enum: StatStatus.options,
			default: 'Current',
			required: true,
		},
		start: {
			type: Date,
			required: true,
		},
		end: {
			type: Date,
			required: true,
		},
		branchId: {
			type: String,
			required: true,
			ref: 'Branch',
		},
		shipVias: {
			type: [ShipViaStatSchema],
			default: [],
		},
		startTotal: {
			type: Number,
			default: 0,
		},
		endTotal: {
			type: Number,
			default: 0,
		},
		totals: {
			type: [Number],
			default: [],
		},
		salesOrders: {
			type: [Number],
			default: [],
		},
		transfers: {
			type: [Number],
			default: [],
		},
		purchases: {
			type: [Number],
			default: [],
		},
		closed: {
			type: Number,
			default: 0,
		},
		closeTimes: {
			type: [Number],
			default: [],
		},
		closeIds: {
			type: [String],
			default: [],
		},
		updated: {
			type: Number,
			default: 0,
		},
		added: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
		collection: 'stats',
	}
);

// Create indexes for performance (based on your Prisma schema)
StatMongoSchema.index({ end: -1 }); // Descending for newest first
StatMongoSchema.index({ branchId: 1 });
StatMongoSchema.index({ status: 1 });
StatMongoSchema.index({ start: 1, end: 1 });

// Export the model
export const StatModel = model<Stat>('Stat', StatMongoSchema);
export default StatModel;
