import { Schema, model } from 'mongoose';
import type { Branch } from '@shared/types';

const BranchMongoSchema = new Schema<Branch>(
	{
		brId: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		num: {
			type: Number,
			required: true,
			unique: true,
			min: 1,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		timestamps: true, // Automatically adds createdAt and updatedAt
		collection: 'branches',
	}
);

// Export the model
export const BranchModel = model<Branch>('Branch', BranchMongoSchema);
export default BranchModel;
