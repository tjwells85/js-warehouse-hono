import { BranchModel } from '@server/db/models';
import type { Branch, BranchSchema } from '@shared/types';
import { HTTPException } from 'hono/http-exception';

/**
 * Get all branches
 */
export const getAllBranches = async (): Promise<Branch[]> => {
	try {
		return await BranchModel.find().sort({ brId: 'asc' }).lean();
	} catch (error) {
		throw new HTTPException(500, { message: 'Failed to fetch branches' });
	}
};

/**
 * Get branch by ID
 */
export const getBranchById = async (id: string): Promise<Branch> => {
	try {
		const branch = await BranchModel.findById(id).lean();
		if (!branch) {
			throw new HTTPException(404, { message: 'Branch not found' });
		}
		return branch;
	} catch (error) {
		if (error instanceof HTTPException) throw error;
		throw new HTTPException(500, { message: 'Failed to fetch branch' });
	}
};

/**
 * Get branch by brId (business ID)
 */
export const getBranchByBrId = async (brId: string): Promise<Branch> => {
	try {
		const branch = await BranchModel.findOne({ brId }).lean();
		if (!branch) {
			throw new HTTPException(404, { message: 'Branch not found' });
		}
		return branch;
	} catch (error) {
		if (error instanceof HTTPException) throw error;
		throw new HTTPException(500, { message: 'Failed to fetch branch' });
	}
};

/**
 * Create a new branch
 */
export const createBranch = async (data: BranchSchema): Promise<Branch> => {
	try {
		const branch = new BranchModel(data);
		const saved = await branch.save();
		return saved.toObject();
	} catch (error: any) {
		if (error.code === 11000) {
			throw new HTTPException(409, { message: 'Branch with this ID or number already exists' });
		}
		throw new HTTPException(500, { message: 'Failed to create branch' });
	}
};

/**
 * Update branch by ID
 */
export const updateBranch = async (id: string, data: Partial<BranchSchema>): Promise<Branch> => {
	try {
		const branch = await BranchModel.findByIdAndUpdate(id, data, { new: true }).lean();
		if (!branch) {
			throw new HTTPException(404, { message: 'Branch not found' });
		}
		return branch;
	} catch (error: any) {
		if (error instanceof HTTPException) throw error;
		if (error.code === 11000) {
			throw new HTTPException(409, { message: 'Branch with this ID or number already exists' });
		}
		throw new HTTPException(500, { message: 'Failed to update branch' });
	}
};

/**
 * Delete branch by ID
 */
export const deleteBranch = async (id: string): Promise<Branch> => {
	try {
		const result = await BranchModel.findByIdAndDelete(id);
		if (!result) {
			throw new HTTPException(404, { message: 'Branch not found' });
		}
		return result;
	} catch (error) {
		if (error instanceof HTTPException) throw error;
		throw new HTTPException(500, { message: 'Failed to delete branch' });
	}
};
