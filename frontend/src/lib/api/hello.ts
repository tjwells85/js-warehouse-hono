import { apiClient } from './client';

export const hello = async () => {
	const res = await apiClient.hello.$get();
	const { message } = await res.json();

	return `${message} from the server!`;
};
