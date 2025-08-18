import type { BaseDocument } from './_base';

export interface Branch extends BaseDocument {
	brId: string;
	num: number;
	name: string;
}
