import { AuditEvent } from '@/types/audit';
import { AuditEventRow } from './AuditEventRow';
import { AuditTableSkeleton } from './AuditTableSkeleton';
import { EmptyState } from './EmptyState';
import { styles } from './AuditTable.styles';

interface AuditTableProps {
  events: AuditEvent[];
  isLoading: boolean;
  hasFilters: boolean;
  onResetFilters: () => void;
  onRefresh: () => void;
}

export function AuditTable({
  events,
  isLoading,
  hasFilters,
  onResetFilters,
  onRefresh,
}: AuditTableProps) {
  if (isLoading) {
    return <AuditTableSkeleton rows={5} />;
  }

  if (events.length === 0) {
    return (
      <EmptyState
        hasFilters={hasFilters}
        onResetFilters={onResetFilters}
        onRefresh={onRefresh}
      />
    );
  }

  return (
    <div className={styles.container}>
      {/* Table header */}
      <div className={styles.header}>
        <div className={styles.headerItem}>תאריך ושעה</div>
        <div className={styles.headerItem}>שחקן</div>
        <div className={styles.headerItem}>שם משתמש</div>
        <div className={styles.headerItem}>פעולה</div>
        <div className={styles.headerItem}>משאב</div>
        <div className={styles.headerItem}>יעד</div>
      </div>

      {/* Event rows */}
      <div className={styles.rowsContainer}>
        {events.map((event) => (
          <AuditEventRow key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
