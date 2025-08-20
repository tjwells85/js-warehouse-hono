import type { Branch, TaskFilterType } from '@shared/types';

export const taskTypeToName = (type?: TaskFilterType): string => {
	switch (type) {
		case 'standard':
			return 'Will Call & Deliveries';
		case 'willcall':
			return 'Will Call';
		case 'transfers':
			return 'Transfers';
		case 'shipouts':
			return 'Ship-Outs';
		case 'nonWillCall':
			return 'Transfers/Deliveries/Ship-Outs';
		case 'deliveries':
			return 'Deliveries';
		default:
			return 'All Picks';
	}
};

export const getPickPageTitle = (branch: Branch, type?: TaskFilterType): string => {
	const taskTypeName = taskTypeToName(type);
	return `${branch.name} ${taskTypeName}`;
};
