export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterSelectProps {
  placeholder: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string | null) => void;
}

export interface SortSelectProps {
  value: string;
  onChange: (value: string | null) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface PageSizeSelectProps {
  value: number;
  onChange: (value: number) => void;
}
