import { useState, useCallback } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { isNil, omitBy } from 'lodash';
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

const initialFilters: AuditFilters = {} as AuditFilters;

export function useAuditEvents(): UseAuditEventsReturn {
  const [filters, setFilters] = useState<AuditFilters>(initialFilters);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  const activeFilters = omitBy(filters, isNil);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['audit-events', pagination.page, pagination.pageSize, activeFilters],
    queryFn: () => fetchAuditEvents({
      page: pagination.page,
      pageSize: pagination.pageSize,
      filters,
    }),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const handleSetFilters: React.Dispatch<React.SetStateAction<AuditFilters>> = useCallback((updater) => {
    // Resolve the new value based on the CURRENT filters state
    const nextFilters = typeof updater === 'function'
      ? (updater as (prev: AuditFilters) => AuditFilters)(filters)
      : updater;

    // Only update if changed
    if (JSON.stringify(filters) !== JSON.stringify(nextFilters)) {
      setFilters(nextFilters);
      // Reset pagination to page 1 when filters change
      setPagination((prev) => ({ ...prev, page: 1 }));
    }
  }, [filters]);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  return {
    events: data?.items || [],
    isLoading,
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
