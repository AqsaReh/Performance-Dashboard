// hooks/use-pagination.ts
import { useState, useCallback, useMemo } from 'react';

export interface UsePaginationProps {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: number;
  totalPages?: number;
}

export interface UsePaginationReturn {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setTotalItems: (total: number) => void;
  setTotalPages: (total: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  getPaginationRequest: () => { page: number; pageSize: number };
}

export const usePagination = ({
  initialPage = 1,
  initialPageSize = 10,
  totalItems = 0,
  totalPages = 0,
}: UsePaginationProps = {}): UsePaginationReturn => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItemsState, setTotalItems] = useState(totalItems);
  const [totalPagesState, setTotalPages] = useState(totalPages);

  const hasNextPage = useMemo(() => page < totalPagesState, [page, totalPagesState]);
  const hasPreviousPage = useMemo(() => page > 1, [page]);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setPage(prev => prev - 1);
    }
  }, [hasPreviousPage]);

  const goToFirstPage = useCallback(() => {
    setPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setPage(totalPagesState);
  }, [totalPagesState]);

  const getPaginationRequest = useCallback(() => ({
    page,
    pageSize,
  }), [page, pageSize]);

  return {
    page,
    pageSize,
    totalItems: totalItemsState,
    totalPages: totalPagesState,
    hasNextPage,
    hasPreviousPage,
    setPage,
    setPageSize,
    setTotalItems,
    setTotalPages,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    getPaginationRequest,
  };
};