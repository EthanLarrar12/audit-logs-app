import { useAuditEvents } from '@/hooks/useAuditEvents';
import { FilterBar } from '@/components/audit/FilterBar';
import { AuditTable } from '@/components/audit/AuditTable';
import { exportToExcel } from '@/lib/exportToExcel';
import { toast } from '@/hooks/use-toast';
import { styles } from './Index.styles';

const Index = () => {
  const {
    events,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isSlowLoading,
    filters,
    setFilters,
    hasNextPage,
    fetchNextPage,
    resetFilters,
    refetch,
  } = useAuditEvents();

  const hasActiveFilters = Object.values(filters).some((v) => v !== null);

  const handleExport = () => {
    try {
      // TODO: Ideally fetch all filtered data for export, currently exporting visible page.
      exportToExcel(events, filters);
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
        {/* Filter bar */}
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          onReset={resetFilters}
          onRefresh={refetch}
          onExport={handleExport}
          isLoading={isSlowLoading}
          isRefreshing={isFetching}
        />

        {/* Audit table */}
        <div className={styles.tableWrapper}>
          <AuditTable
            events={events}
            isLoading={isLoading || isSlowLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            hasFilters={hasActiveFilters}
            onResetFilters={resetFilters}
            onRefresh={refetch}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
