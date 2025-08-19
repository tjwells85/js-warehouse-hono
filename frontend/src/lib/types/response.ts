type ApiSuccess<T = unknown> = { status: number; data: T; error?: never };
type ApiFailure<E = unknown> = { status: number; data?: never; error: E };

export type ApiResponse<T = unknown, E = unknown> = ApiSuccess<T> | ApiFailure<E>;
