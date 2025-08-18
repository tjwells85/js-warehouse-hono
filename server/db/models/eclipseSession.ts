import { Schema, model } from 'mongoose';
import type { EclipseSession } from '@shared/types';

const EclipseSessionMongoSchema = new Schema<EclipseSession>(
	{
		sessionId: {
			type: String,
			required: true,
		},
		sessionToken: {
			type: String,
			required: true,
		},
		refreshToken: {
			type: String,
			required: true,
		},
		applicationKey: {
			type: String,
			default: '',
		},
		developerKey: {
			type: String,
			default: '',
		},
		clientDescription: {
			type: String,
			default: '',
		},
		deviceId: {
			type: String,
			default: '',
		},
		workstationId: {
			type: String,
			default: '',
		},
		printerLocationId: {
			type: String,
			default: '',
		},
		validPrinterLocationIds: {
			type: [String],
			default: [],
		},
		alternateSessionId: {
			type: String,
			default: '',
		},
		creationDateTime: {
			type: Date,
			required: true,
		},
		lastUsedDateTime: {
			type: Date,
			required: true,
		},
		expiresIn: {
			type: Number,
			required: false,
		},
		tokenType: {
			type: String,
			required: false,
		},
		isValid: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
		collection: 'eclipsesessions',
	}
);

// Create indexes for performance
EclipseSessionMongoSchema.index({ sessionId: 1 });
EclipseSessionMongoSchema.index({ isValid: 1 });
EclipseSessionMongoSchema.index({ lastUsedDateTime: -1 });

// Export the model
export const EclipseSessionModel = model<EclipseSession>('EclipseSession', EclipseSessionMongoSchema);
export default EclipseSessionModel;
