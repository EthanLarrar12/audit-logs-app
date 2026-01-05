import { useAuditEvents } from '@/hooks/useAuditEvents';
import { AuditLogHeader } from '@/components/audit/AuditLogHeader';
import { FilterBar } from '@/components/audit/FilterBar';
import { AuditTable } from '@/components/audit/AuditTable';
import { Pagination } from '@/components/audit/Pagination';
import { exportToExcel } from '@/lib/exportToExcel';
import { toast } from '@/hooks/use-toast';
import { styles } from './Index.styles';

const Index = () => {
  const {
    events,
    isLoading,
    isSlowLoading,
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
      // TODO: Ideally fetch all filtered data for export, currently exporting visible page.
      exportToExcel(events);
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
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <AuditLogHeader
          totalEvents={pagination.total}
          onRefresh={refetch}
          onExport={handleExport}
          isLoading={isSlowLoading}
        />

        {/* Filter bar */}
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          onReset={resetFilters}
          isLoading={isSlowLoading}
        />

        {/* Audit table */}
        <div className={styles.tableWrapper}>
          <AuditTable
            events={events}
            isLoading={isLoading || isSlowLoading}
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
