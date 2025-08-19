export const getLocalDate = (date: Date): Date => {
	const now = new Date();
	if (date.getTimezoneOffset() === now.getTimezoneOffset()) {
		return date;
	}
	return new Date(date.getTime() + now.getTimezoneOffset() * 60000);
};
