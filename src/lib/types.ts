export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string | null | undefined;
  tags?:
    | {
        tag: string;
        id?: string | null;
      }[]
    | null;
  folder?: string | null;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BookmarkInput {
  title: string;
  url: string;
  description: string;
  folder: string;
  tags: string[];
}

export interface Tag {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Folder {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BookmarksResponse {
  docs: Bookmark[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface TagsResponse {
  docs: Tag[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface FoldersResponse {
  docs: Folder[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface BookmarkFilters {
  tag?: string;
  folder?: string;
  search?: string;
}

export interface SortOption {
  field: "title" | "createdAt" | "updatedAt";
  direction: "asc" | "desc";
}
