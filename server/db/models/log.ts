import { Schema, model } from 'mongoose';
import type { Log } from '@shared/types';
import { LogType } from '@shared/types';

const LogMongoSchema = new Schema<Log>(
	{
		timestamp: {
			type: Date,
			default: Date.now,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		file: {
			type: String,
			default: '',
		},
		route: {
			type: String,
			default: '',
		},
		line: {
			type: String,
			default: '',
		},
		httpStatus: {
			type: String,
			default: '',
		},
		fn: {
			type: String,
			default: '',
		},
		type: {
			type: String,
			enum: LogType.options,
			required: true,
		},
		time: {
			type: Number,
			default: -1.0,
		},
	},
	{
		timestamps: true,
		collection: 'logs',
	}
);

// Create indexes for performance and your existing query patterns
LogMongoSchema.index({ timestamp: -1 }); // Descending for newest first
LogMongoSchema.index({ type: 1 });
LogMongoSchema.index({ route: 1 });

// Export the model
export const LogModel = model<Log>('Log', LogMongoSchema);
export default LogModel;
