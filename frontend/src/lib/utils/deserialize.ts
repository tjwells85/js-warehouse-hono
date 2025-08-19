import superjson from 'superjson';

export const deserialize = async <T = unknown>(res: Response): Promise<T> => {
	const json = await res.json();
	return superjson.deserialize<T>(json);
};
