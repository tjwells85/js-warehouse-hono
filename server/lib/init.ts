import { connectToDatabase } from '@server/db';
import { ProcessEnv } from '@server/env';

/**
 * Initialize database connection
 */
const initDatabase = async (): Promise<void> => {
	if (ProcessEnv.DEV_MODE) {
		console.log('🚀 Initializing database...');
	}
	await connectToDatabase();
};

/**
 * Initialize authentication system
 * TODO: Add better-auth initialization here
 */
const initAuth = async (): Promise<void> => {
	if (ProcessEnv.DEV_MODE) {
		console.log('🔐 Initializing authentication...');
	}
	// Placeholder for better-auth setup
};

/**
 * Initialize cron jobs
 * TODO: Add cron job setup here
 */
const initCronJobs = async (): Promise<void> => {
	if (ProcessEnv.DEV_MODE) {
		console.log('⏰ Initializing cron jobs...');
	}
	// Placeholder for cron setup
};

/**
 * Master initialization function
 * Calls all initialization functions in the correct order
 */
export const init = async (): Promise<void> => {
	try {
		if (ProcessEnv.DEV_MODE) {
			console.log('🎬 Starting server initialization...');
		}

		// Initialize in order of dependency
		await initDatabase();
		await initAuth();
		await initCronJobs();

		if (ProcessEnv.DEV_MODE) {
			console.log('✅ Server initialization complete!');
		}
	} catch (error) {
		console.error('💥 Server initialization failed:', error);
		process.exit(1);
	}
};
