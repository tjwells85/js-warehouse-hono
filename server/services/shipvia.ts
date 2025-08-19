import { ShipViaModel } from '@server/db/models';
import type { ShipVia, ShipViaSchema } from '@shared/types';
import { HTTPException } from 'hono/http-exception';

/**
 * Get all ship vias
 */
export const getAllShipVias = async (): Promise<ShipVia[]> => {
	try {
		return await ShipViaModel.find().sort({ priority: 1, name: 1 }).lean();
	} catch (error: any) {
		throw new HTTPException(500, { message: 'Failed to fetch ship vias' });
	}
};

/**
 * Get ship via by ID
 */
export const getShipViaById = async (id: string): Promise<ShipVia> => {
	try {
		const shipVia = await ShipViaModel.findById(id).lean();
		if (!shipVia) {
			throw new HTTPException(404, { message: 'Ship via not found' });
		}
		return shipVia;
	} catch (error: any) {
		if (error instanceof HTTPException) throw error;
		throw new HTTPException(500, { message: 'Failed to fetch ship via' });
	}
};

/**
 * Get ship via by name
 */
export const getShipViaByName = async (name: string): Promise<ShipVia> => {
	try {
		const shipVia = await ShipViaModel.findOne({ name }).lean();
		if (!shipVia) {
			throw new HTTPException(404, { message: 'Ship via not found' });
		}
		return shipVia;
	} catch (error: any) {
		if (error instanceof HTTPException) throw error;
		throw new HTTPException(500, { message: 'Failed to fetch ship via' });
	}
};

/**
 * Get ship vias by type
 */
export const getShipViasByType = async (type: 'WillCall' | 'Delivery' | 'ShipOut'): Promise<ShipVia[]> => {
	try {
		return await ShipViaModel.find({ type }).sort({ priority: 1, name: 1 }).lean();
	} catch (error: any) {
		throw new HTTPException(500, { message: 'Failed to fetch ship vias by type' });
	}
};

/**
 * Create a new ship via
 */
export const createShipVia = async (data: ShipViaSchema): Promise<ShipVia> => {
	try {
		const shipVia = new ShipViaModel(data);
		const saved = await shipVia.save();
		return saved.toObject();
	} catch (error: any) {
		if (error.code === 11000) {
			throw new HTTPException(409, { message: 'Ship via with this name already exists' });
		}
		throw new HTTPException(500, { message: 'Failed to create ship via' });
	}
};

/**
 * Update ship via by ID
 */
export const updateShipVia = async (id: string, data: Partial<ShipViaSchema>): Promise<ShipVia> => {
	try {
		const shipVia = await ShipViaModel.findByIdAndUpdate(id, data, { new: true }).lean();
		if (!shipVia) {
			throw new HTTPException(404, { message: 'Ship via not found' });
		}
		return shipVia;
	} catch (error: any) {
		if (error instanceof HTTPException) throw error;
		if (error.code === 11000) {
			throw new HTTPException(409, { message: 'Ship via with this name already exists' });
		}
		throw new HTTPException(500, { message: 'Failed to update ship via' });
	}
};

/**
 * Update ship via by name
 */
export const updateShipViaByName = async (name: string, data: Partial<ShipViaSchema>): Promise<ShipVia> => {
	try {
		const shipVia = await ShipViaModel.findOneAndUpdate({ name }, data, { new: true }).lean();
		if (!shipVia) {
			throw new HTTPException(404, { message: 'Ship via not found' });
		}
		return shipVia;
	} catch (error: any) {
		if (error instanceof HTTPException) throw error;
		if (error.code === 11000) {
			throw new HTTPException(409, { message: 'Ship via with this name already exists' });
		}
		throw new HTTPException(500, { message: 'Failed to update ship via' });
	}
};

/**
 * Delete ship via by ID
 */
export const deleteShipVia = async (id: string): Promise<void> => {
	try {
		const result = await ShipViaModel.findByIdAndDelete(id);
		if (!result) {
			throw new HTTPException(404, { message: 'Ship via not found' });
		}
	} catch (error: any) {
		if (error instanceof HTTPException) throw error;
		throw new HTTPException(500, { message: 'Failed to delete ship via' });
	}
};
