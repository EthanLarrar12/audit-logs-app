import { useAuditEvents } from '@/hooks/useAuditEvents';
import { AuditLogHeader } from '@/components/audit/AuditLogHeader';
import { FilterBar } from '@/components/audit/FilterBar';
import { AuditTable } from '@/components/audit/AuditTable';
import { Pagination } from '@/components/audit/Pagination';

const Index = () => {
  const {
    events,
    isLoading,
    filters,
    setFilters,
    pagination,
    setPagination,
    resetFilters,
    refetch,
  } = useAuditEvents();

  const hasActiveFilters = Object.values(filters).some((v) => v !== null);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <AuditLogHeader
          totalEvents={pagination.total}
          onRefresh={refetch}
          isLoading={isLoading}
        />

        {/* Filter bar */}
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          onReset={resetFilters}
        />

        {/* Audit table */}
        <div className="bg-card border rounded-lg p-4">
          <AuditTable
            events={events}
            isLoading={isLoading}
            hasFilters={hasActiveFilters}
            onResetFilters={resetFilters}
            onRefresh={refetch}
          />

          {/* Pagination */}
          <Pagination
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
