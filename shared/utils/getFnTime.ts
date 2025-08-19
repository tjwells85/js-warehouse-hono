export const getFnTime = (before: number, after: number): number => {
	return (after - before) / 1000; // Convert to seconds
};
