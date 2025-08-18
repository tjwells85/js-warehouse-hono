import { Schema, model } from 'mongoose';
import type { ShipVia } from '@shared/types';
import { ShipViaType } from '@shared/types';

const ShipViaMongoSchema = new Schema<ShipVia>(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		priority: {
			type: Number,
			required: true,
			min: 0,
		},
		type: {
			type: String,
			enum: ShipViaType.options,
			default: 'WillCall',
			required: true,
		},
	},
	{
		timestamps: true,
		collection: 'shipvias',
	}
);

// Create indexes for performance
ShipViaMongoSchema.index({ name: 1 });
ShipViaMongoSchema.index({ priority: 1 });

// Export the model
export const ShipViaModel = model<ShipVia>('ShipVia', ShipViaMongoSchema);
export default ShipViaModel;
