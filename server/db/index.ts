import mongoose from 'mongoose';
import { ProcessEnv } from '@server/env';

// Connection state management
let isConnected = false;

// Mongoose connection options for production-ready setup
const connectionOptions = {
	bufferCommands: false, // Disable mongoose buffering
	maxPoolSize: 10, // Maintain up to 10 socket connections
	serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
	socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
	family: 4, // Use IPv4, skip trying IPv6
};

export const connectToDatabase = async (): Promise<void> => {
	if (isConnected) {
		if (ProcessEnv.DEV_MODE) {
			console.log('📦 Already connected to MongoDB');
		}
		return;
	}

	try {
		if (ProcessEnv.DEV_MODE) {
			console.log('🔌 Connecting to MongoDB...');
			mongoose.set('debug', true); // Enable query logging in dev
		}

		const connection = await mongoose.connect(ProcessEnv.DATABASE_URL, connectionOptions);

		isConnected = true;

		if (ProcessEnv.DEV_MODE) {
			console.log(`✅ Connected to MongoDB: ${connection.connection.name}`);
			console.log(`📍 Host: ${connection.connection.host}:${connection.connection.port}`);
		}

		// Handle connection events
		mongoose.connection.on('error', (error) => {
			console.error('❌ MongoDB connection error:', error);
			isConnected = false;
		});

		mongoose.connection.on('disconnected', () => {
			console.warn('⚠️  MongoDB disconnected');
			isConnected = false;
		});

		// Graceful shutdown
		process.on('SIGINT', async () => {
			if (ProcessEnv.DEV_MODE) {
				console.log('\n🔌 Closing MongoDB connection...');
			}
			await mongoose.connection.close();
			process.exit(0);
		});
	} catch (error) {
		console.error('💥 Failed to connect to MongoDB:', error);
		process.exit(1); // Exit with error code
	}
};

export const disconnectFromDatabase = async (): Promise<void> => {
	if (!isConnected) return;

	try {
		await mongoose.connection.close();
		isConnected = false;
		if (ProcessEnv.DEV_MODE) {
			console.log('🔌 Disconnected from MongoDB');
		}
	} catch (error) {
		console.error('❌ Error disconnecting from MongoDB:', error);
	}
};

// Export the connection status
export const getDatabaseStatus = () => ({
	isConnected,
	readyState: mongoose.connection.readyState,
	host: mongoose.connection.host,
	port: mongoose.connection.port,
	name: mongoose.connection.name,
});

// Export mongoose for model definitions
export { mongoose };
