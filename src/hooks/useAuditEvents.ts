import { useState, useCallback, useMemo, useEffect } from 'react';
import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import { isNil, omitBy } from 'lodash';
import { AuditEvent, AuditFilters } from '@/types/audit';
import { useDelayedLoading } from './useDelayedLoading';
import { fetchAuditEvents } from '@/lib/api';
import { useUrlFilters } from './useUrlFilters';
import { DEFAULT_PAGE_SIZE } from '../../server/src/shared/auditConstants';

interface UseAuditEventsReturn {
  events: AuditEvent[];
  isLoading: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  isSlowLoading: boolean;
  hasNextPage: boolean;
  error: Error | null;
  filters: AuditFilters;
  setFilters: React.Dispatch<React.SetStateAction<AuditFilters>>;
  fetchNextPage: () => void;
  resetFilters: () => void;
  refetch: () => void;
}

const PAGE_SIZE = DEFAULT_PAGE_SIZE;

export const useAuditEvents = (): UseAuditEventsReturn => {
  const { getFiltersFromUrl, syncFiltersToUrl } = useUrlFilters();

  // Initialize filters from URL on mount
  const [filters, setFilters] = useState<AuditFilters>(() => getFiltersFromUrl());

  const activeFilters = omitBy(filters, isNil);

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey: ['audit-events', activeFilters],
    queryFn: ({ pageParam = 1 }) => fetchAuditEvents({
      page: pageParam as number,
      filters,
    }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.items.length === PAGE_SIZE ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const isSlowLoading = useDelayedLoading(isFetching && !isFetchingNextPage, 200);

  const events = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) || [];
  }, [data]);

  // Sync filters to URL whenever they change
  useEffect(() => {
    syncFiltersToUrl(filters);
  }, [filters, syncFiltersToUrl]);

  const handleSetFilters: React.Dispatch<React.SetStateAction<AuditFilters>> = useCallback((updater) => {
    // Resolve the new value based on the CURRENT filters state
    const nextFilters = typeof updater === 'function'
      ? (updater as (prev: AuditFilters) => AuditFilters)(filters)
      : updater;

    // Only update if changed
    if (JSON.stringify(filters) !== JSON.stringify(nextFilters)) {
      setFilters(nextFilters);
    }
  }, [filters]);

  const resetFilters = useCallback(() => {
    setFilters({} as AuditFilters);
  }, []);

  return {
    events,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isSlowLoading,
    hasNextPage: !!hasNextPage,
    error: error as Error | null,
    filters,
    setFilters: handleSetFilters,
    fetchNextPage,
    resetFilters,
    refetch,
  };
}
