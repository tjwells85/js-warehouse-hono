import cron from 'node-cron';
import { ProcessEnv } from '@server/env';
import { withEclipse } from '@server/services/eclipse/session';
import { getAllBranchPicks } from '@server/services/eclipse/tasks';
import { LogModel, TaskModel, StatModel } from '@server/db/models';
import { getFnTime } from '@shared/utils';

/**
 * Main task sync job - fetches all branch picking tasks from Eclipse API
 */
const syncTasks = async (): Promise<void> => {
	const before = Date.now();

	try {
		await withEclipse(getAllBranchPicks);

		const after = Date.now();

		if (ProcessEnv.DEV_MODE) {
			console.log(`✅ Task sync completed in ${getFnTime(before, after)}s`);
		}
	} catch (error: any) {
		const after = Date.now();

		await LogModel.create({
			message: `Cron task sync failed: ${error.message}`,
			type: 'Error',
			file: 'server/services/cron.ts',
			fn: 'syncTasks',
			time: getFnTime(before, after),
		});

		console.error('❌ Cron task sync failed:', error.message);
	}
};

/**
 * Daily cleanup job - closes old stats and performs maintenance
 */
const dailyCleanup = async (): Promise<void> => {
	const before = Date.now();

	try {
		// Close stats older than today that aren't already closed/purged
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		const closeResult = await StatModel.updateMany(
			{
				end: { $lt: today },
				status: 'Current',
			},
			{ status: 'Closed' }
		);

		// Optionally clean up very old closed tasks (older than 30 days)
		const thirtyDaysAgo = new Date(today);
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const cleanupResult = await TaskModel.deleteMany({
			taskState: 'Closed',
			updatedAt: { $lt: thirtyDaysAgo },
		});

		const after = Date.now();

		await LogModel.create({
			message: `Daily cleanup completed. Stats closed: ${closeResult.modifiedCount}, Old tasks cleaned: ${cleanupResult.deletedCount}`,
			type: 'Success',
			file: 'server/services/cron.ts',
			fn: 'dailyCleanup',
			time: getFnTime(before, after),
		});

		if (ProcessEnv.DEV_MODE) {
			console.log(`🧹 Daily cleanup completed in ${getFnTime(before, after)}s`);
		}
	} catch (error: any) {
		const after = Date.now();

		await LogModel.create({
			message: `Daily cleanup failed: ${error.message}`,
			type: 'Error',
			file: 'server/services/cron.ts',
			fn: 'dailyCleanup',
			time: getFnTime(before, after),
		});

		console.error('❌ Daily cleanup failed:', error.message);
	}
};

/**
 * Initialize and start all cron jobs
 */
export const initCronJobs = (): void => {
	// Main sync job - every minute
	cron.schedule('* * * * *', syncTasks, {
		timezone: 'America/Los_Angeles', // Adjust to your timezone
	});

	// Daily cleanup job - at midnight
	cron.schedule('0 0 * * *', dailyCleanup, {
		timezone: 'America/Los_Angeles', // Adjust to your timezone
	});

	if (ProcessEnv.DEV_MODE) {
		console.log('⏰ Cron jobs initialized');
		console.log('  - Task sync: every minute');
		console.log('  - Daily cleanup: midnight');
	}
};

/**
 * Manual trigger for task sync (useful for testing or manual refresh)
 */
export const triggerTaskSync = async (): Promise<void> => {
	await syncTasks();
};

/**
 * Manual trigger for daily cleanup (useful for testing)
 */
export const triggerDailyCleanup = async (): Promise<void> => {
	await dailyCleanup();
};
