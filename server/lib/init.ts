import { connectToDatabase } from '@server/db';
import { ProcessEnv } from '@server/env';
import { initCronJobs as startCronJobs } from '@server/services/cron';
import { authDb } from './auth';
import path from 'node:path';
import { ensureDefaultAdmin } from '@server/services/user';

/**
 * Initialize database connection
 */
const initDatabase = async (): Promise<void> => {
	if (ProcessEnv.DEV_MODE) {
		console.log('🚀 Initializing database...');
	}
	await connectToDatabase();
};

const migrateAuthDatabase = async (): Promise<void> => {
	try {
		console.log('🔄 Running auth database migration...');

		const schemaPath = path.join(process.cwd(), 'lib/authSchema.sql');
		const schema = await Bun.file(schemaPath).text();

		// Execute the schema - safe to run multiple times due to IF NOT EXISTS
		authDb.run(schema);

		console.log('✅ Auth database migration completed successfully');
	} catch (error) {
		console.error('❌ Auth database migration failed:', error);
		throw error; // Re-throw to prevent server from starting with broken auth
	}
};

/**
 * Initialize authentication system
 * TODO: Add better-auth initialization here
 */
const initAuth = async (): Promise<void> => {
	if (ProcessEnv.DEV_MODE) {
		console.log('🔐 Initializing authentication...');
	}

	await migrateAuthDatabase();
	await ensureDefaultAdmin();
};

/**
 * Initialize cron jobs
 * TODO: Add cron job setup here
 */
const initCronJobs = async (): Promise<void> => {
	if (ProcessEnv.DEV_MODE) {
		console.log('⏰ Initializing cron jobs...');
	}

	startCronJobs();
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
