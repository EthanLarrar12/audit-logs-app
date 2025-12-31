import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuditEvent, AuditFilters, PaginationState } from '@/types/audit';
import { fetchAuditEvents } from '@/lib/api';

interface UseAuditEventsReturn {
  events: AuditEvent[];
  isLoading: boolean;
  error: Error | null;
  filters: AuditFilters;
  setFilters: React.Dispatch<React.SetStateAction<AuditFilters>>;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  resetFilters: () => void;
  refetch: () => void;
}

const initialFilters: AuditFilters = {
  searchInput: null,
  actorSearch: null,
  targetSearch: null,
  resourceSearch: null,
  actorUsername: null,
  category: null,
  action: null,
  dateFrom: null,
  dateTo: null,
};

export function useAuditEvents(): UseAuditEventsReturn {
  const [filters, setFilters] = useState<AuditFilters>(initialFilters);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['audit-events', pagination.page, pagination.pageSize, filters],
    queryFn: () => fetchAuditEvents({
      page: pagination.page,
      pageSize: pagination.pageSize,
      filters,
    }),
    placeholderData: (prev) => prev, // Keep previous data during fetch to avoid flicker
  });

  // Custom setter for filters to reset pagination to page 1 on change
  const handleSetFilters: React.Dispatch<React.SetStateAction<AuditFilters>> = useCallback((updater) => {
    setFilters((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      // Only reset page if filters actually changed
      if (JSON.stringify(prev) !== JSON.stringify(next)) {
        setPagination((p) => ({ ...p, page: 1 }));
      }
      return next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  return {
    events: data?.items || [],
    isLoading: isFetching,
    error: error as Error | null,
    filters,
    setFilters: handleSetFilters,
    pagination: {
      ...pagination,
      total: data?.total || 0,
    },
    setPagination,
    resetFilters,
    refetch,
  };
}
