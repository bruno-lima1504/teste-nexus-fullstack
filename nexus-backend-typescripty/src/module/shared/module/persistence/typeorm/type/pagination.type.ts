export type PaginatedResult<T> = {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export type PaginationOptions = {
  page?: number;
  limit?: number;
};
