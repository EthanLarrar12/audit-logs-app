import { useState } from 'react';
import { useAuditEvents } from '@/hooks/useAuditEvents';
import { FilterBar } from '@/components/audit/FilterBar';
import { AuditTable } from '@/components/audit/AuditTable';
import { exportToExcel } from '@/lib/exportToExcel';
import { fetchAllAuditEvents } from '@/lib/api';
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

  const [isExporting, setIsExporting] = useState(false);

  const hasActiveFilters = Object.values(filters).some((v) => {
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'string') return v.trim().length > 0;
    return v !== null && v !== undefined;
  });

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const allEvents = await fetchAllAuditEvents(filters);
      exportToExcel(allEvents, filters);
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
    } finally {
      setIsExporting(false);
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
          isLoading={isSlowLoading}
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
            onExport={handleExport}
            isExporting={isExporting}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
