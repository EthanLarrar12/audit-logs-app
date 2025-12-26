import { useState, useMemo } from 'react';
import { AuditEvent, AuditFilters, PaginationState } from '@/types/audit';
import { mockAuditEvents } from '@/data/mockAuditData';

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
  action: null,
  actor_type: null,
  resource_type: null,
  outcome: null,
  dateFrom: null,
  dateTo: null,
};

export function useAuditEvents(): UseAuditEventsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error] = useState<Error | null>(null);
  const [filters, setFilters] = useState<AuditFilters>(initialFilters);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: mockAuditEvents.length,
  });

  // TODO: Replace with actual API call
  // This should integrate with your backend service
  // Example: GET /api/audit-events?action=...&actor_type=...&page=...
  const filteredEvents = useMemo(() => {
    let result = [...mockAuditEvents];

    if (filters.action) {
      result = result.filter((e) => e.action === filters.action);
    }
    if (filters.actor_type) {
      result = result.filter((e) => e.actor_type === filters.actor_type);
    }
    if (filters.resource_type) {
      result = result.filter((e) => e.resource_type === filters.resource_type);
    }
    if (filters.outcome) {
      result = result.filter((e) => e.outcome === filters.outcome);
    }
    if (filters.dateFrom) {
      result = result.filter(
        (e) => new Date(e.created_at) >= filters.dateFrom!
      );
    }
    if (filters.dateTo) {
      result = result.filter((e) => new Date(e.created_at) <= filters.dateTo!);
    }

    return result;
  }, [filters]);

  // Paginated events
  const events = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredEvents.slice(start, end);
  }, [filteredEvents, pagination.page, pagination.pageSize]);

  const resetFilters = () => {
    setFilters(initialFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const refetch = () => {
    // TODO: Implement actual API refetch
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500); // Simulate loading
  };

  return {
    events,
    isLoading,
    error,
    filters,
    setFilters,
    pagination: { ...pagination, total: filteredEvents.length },
    setPagination,
    resetFilters,
    refetch,
  };
}
