import { useAuditEvents } from '@/hooks/useAuditEvents';
import { AuditLogHeader } from '@/components/audit/AuditLogHeader';
import { FilterBar } from '@/components/audit/FilterBar';
import { AuditTable } from '@/components/audit/AuditTable';
import { Pagination } from '@/components/audit/Pagination';
import { exportToExcel } from '@/lib/exportToExcel';
import { mockAuditEvents } from '@/data/mockAuditData';
import { toast } from '@/hooks/use-toast';

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

  const handleExport = () => {
    try {
      // TODO: Replace with filtered API data when backend is ready
      exportToExcel(mockAuditEvents);
      toast({
        title: 'הייצוא הושלם',
        description: 'קובץ האקסל הורד בהצלחה.',
      });
    } catch (error) {
      toast({
        title: 'שגיאה בייצוא',
        description: 'לא ניתן היה לייצא את הנתונים. נסה שוב.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <AuditLogHeader
          totalEvents={pagination.total}
          onRefresh={refetch}
          onExport={handleExport}
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
