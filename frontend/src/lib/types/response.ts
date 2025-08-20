type ApiSuccess<T = unknown> = { status: number; data: T; error?: never };
type ApiFailure<E = unknown> = { status: number; data?: never; error: E };

export type ApiResponse<T = unknown, E = unknown> = ApiSuccess<T> | ApiFailure<E>;

export const isSuccess = <T = unknown, E = unknown>(response: ApiResponse<T, E>): response is ApiSuccess<T> => {
	return !!response.data;
};

export const isFailure = <T = unknown, E = unknown>(response: ApiResponse<T, E>): response is ApiFailure<E> => {
	return !response.data;
};
