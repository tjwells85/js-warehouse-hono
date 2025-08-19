import { auth, authDb } from '@server/lib/auth';
import { ProcessEnv } from '@server/env';
import { HTTPException } from 'hono/http-exception';
import type { UserSchema } from '@shared/types';

/**
 * Check if default admin user exists, create if not
 */
export const ensureDefaultAdmin = async (): Promise<void> => {
	try {
		// Check if any admin users exist
		const adminQuery = authDb.prepare('SELECT COUNT(*) as count FROM user WHERE role = ?');
		const result = adminQuery.get('admin') as { count: number };

		if (result.count === 0) {
			console.log('🔧 No admin users found, creating default admin...');

			// Create admin user using better-auth admin plugin
			const adminUser = await auth.api.createUser({
				body: {
					email: ProcessEnv.DEFAULT_ADMIN_EMAIL,
					password: ProcessEnv.DEFAULT_ADMIN_PASSWORD,
					name: ProcessEnv.DEFAULT_ADMIN_NAME,
					role: 'admin',
				} satisfies UserSchema,
			});

			if (adminUser) {
				console.log(`✅ Default admin user created: ${ProcessEnv.DEFAULT_ADMIN_EMAIL}`);
			} else {
				throw new Error('Failed to create default admin user');
			}
		} else {
			if (ProcessEnv.DEV_MODE) {
				console.log(`👤 Found ${result.count} admin user(s)`);
			}
		}
	} catch (error: any) {
		console.error('❌ Failed to ensure default admin:', error);
		throw error;
	}
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async () => {
	try {
		const query = authDb.prepare(`
      SELECT id, email, name, role, emailVerified, banned, banReason, banExpires, createdAt, updatedAt 
      FROM user 
      ORDER BY createdAt DESC
    `);
		return query.all();
	} catch (error: any) {
		throw new HTTPException(500, { message: 'Failed to fetch users' });
	}
};

/**
 * Get user by ID (admin only)
 */
export const getUserById = async (id: string) => {
	try {
		const query = authDb.prepare(`
      SELECT id, email, name, role, emailVerified, banned, banReason, banExpires, createdAt, updatedAt 
      FROM user 
      WHERE id = ?
    `);
		const user = query.get(id);

		if (!user) {
			throw new HTTPException(404, { message: 'User not found' });
		}

		return user;
	} catch (error: any) {
		if (error instanceof HTTPException) throw error;
		throw new HTTPException(500, { message: 'Failed to fetch user' });
	}
};

/**
 * Create user (admin only)
 */
export const createUser = async (userData: UserSchema) => {
	try {
		const result = await auth.api.createUser({
			body: {
				email: userData.email,
				password: userData.password,
				name: userData.name,
				role: userData.role || 'user',
			},
		});

		if (!result) {
			throw new HTTPException(400, { message: 'Failed to create user' });
		}

		return result;
	} catch (error: any) {
		if (error instanceof HTTPException) throw error;
		if (error.message?.includes('UNIQUE constraint failed')) {
			throw new HTTPException(409, { message: 'User with this email already exists' });
		}
		throw new HTTPException(500, { message: 'Failed to create user' });
	}
};

/**
 * Update user (admin only)
 */
export const updateUser = async (id: string, userData: Partial<UserSchema>) => {
	try {
		// Build update query dynamically
		const fields = [];
		const values = [];

		if (userData.email !== undefined) {
			fields.push('email = ?');
			values.push(userData.email);
		}
		if (userData.name !== undefined) {
			fields.push('name = ?');
			values.push(userData.name);
		}
		if (userData.role !== undefined) {
			fields.push('role = ?');
			values.push(userData.role);
		}
		if (userData.banned !== undefined) {
			fields.push('banned = ?');
			values.push(userData.banned);
		}
		if (userData.banReason !== undefined) {
			fields.push('banReason = ?');
			values.push(userData.banReason);
		}

		if (fields.length === 0) {
			throw new HTTPException(400, { message: 'No fields to update' });
		}

		fields.push('updatedAt = CURRENT_TIMESTAMP');
		values.push(id);

		const query = authDb.prepare(`
      UPDATE user 
      SET ${fields.join(', ')} 
      WHERE id = ?
    `);

		const result = query.run(...values);

		if (result.changes === 0) {
			throw new HTTPException(404, { message: 'User not found' });
		}

		return getUserById(id);
	} catch (error: any) {
		if (error instanceof HTTPException) throw error;
		if (error.message?.includes('UNIQUE constraint failed')) {
			throw new HTTPException(409, { message: 'Email already exists' });
		}
		throw new HTTPException(500, { message: 'Failed to update user' });
	}
};

/**
 * Delete user (admin only)
 */
export const deleteUser = async (id: string) => {
	try {
		const query = authDb.prepare('DELETE FROM user WHERE id = ?');
		const result = query.run(id);

		if (result.changes === 0) {
			throw new HTTPException(404, { message: 'User not found' });
		}

		return { message: 'User deleted successfully' };
	} catch (error: any) {
		if (error instanceof HTTPException) throw error;
		throw new HTTPException(500, { message: 'Failed to delete user' });
	}
};
