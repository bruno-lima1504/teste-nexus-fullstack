export class PaginatedResponseDto<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  constructor(result: PaginatedResponseDto<T>) {
    this.data = result.data;
    this.meta = result.meta;
  }
}
