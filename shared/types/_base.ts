/**
 * Base interface for all MongoDB documents
 * Contains the standard fields that Mongoose adds automatically
 */

export interface BaseDocument {
	_id: string;
	createdAt: Date;
	updatedAt: Date;
}
