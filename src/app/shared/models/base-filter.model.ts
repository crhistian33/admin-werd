export interface BaseFilter {
  page?: number;
  limit?: number;
  search: string;
  onlyTrash?: boolean;
}
