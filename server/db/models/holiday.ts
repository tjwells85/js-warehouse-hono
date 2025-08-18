import { Schema, model } from 'mongoose';
import type { Holiday } from '@shared/types';

const HolidayMongoSchema = new Schema<Holiday>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		start: {
			type: Date,
			required: true,
		},
		end: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true,
		collection: 'holidays',
	}
);

// Create indexes for performance
HolidayMongoSchema.index({ start: 1 });
HolidayMongoSchema.index({ end: 1 });
HolidayMongoSchema.index({ start: 1, end: 1 }); // For date range queries

// Export the model
export const HolidayModel = model<Holiday>('Holiday', HolidayMongoSchema);
export default HolidayModel;
